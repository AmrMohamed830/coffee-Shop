"use client"
import { create } from "zustand";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebase";

interface AdminState {
  isAdminMode: boolean;
  isAccessGranted: boolean;
  showPasswordModal: boolean;
  passwordError: string;
  userProfile: User | null;
  initAuthListener: () => () => void;
  toggleAdminMode: () => void;
  handlePasswordSubmit: (password: string) => Promise<void>;
  closeModal: () => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdminMode: false,
  isAccessGranted: false,
  showPasswordModal: false,
  passwordError: '',
  userProfile: null,

  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ userProfile: user });
      if (!user) {
        // If user logs out, reset admin mode
        set({ isAdminMode: false, isAccessGranted: false });
      }
    });
    return unsubscribe;
  },

  toggleAdminMode: () => {
    const { isAccessGranted } = get();
    if (isAccessGranted) {
      // If access is granted, turning the toggle off revokes access
      set({ isAdminMode: false, isAccessGranted: false });
    } else {
      // If access is not granted, show password modal
      set({ isAdminMode: true, showPasswordModal: true });
    }
  },

  handlePasswordSubmit: async (password: string) => {
    const { userProfile } = get();
    if (!password) {
        set({ passwordError: "الرجاء إدخال كلمة المرور." });
        return;
    }
    if (!userProfile || !userProfile.email) {
        set({ passwordError: "لا يمكن التحقق من المستخدم الحالي." });
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, userProfile.email, password);
        set({ isAccessGranted: true, showPasswordModal: false, passwordError: '', isAdminMode: true });
    } catch (error) {
        console.error("Password verification failed:", error);
        set({ passwordError: "كلمة المرور غير صحيحة." });
    }
  },

  closeModal: () => {
    // If user closes modal without success, turn off admin mode toggle
    if (!get().isAccessGranted) {
      set({ showPasswordModal: false, passwordError: '', isAdminMode: false });
    } else {
      set({ showPasswordModal: false, passwordError: '' });
    }
  },
  
  logout: () => {
    set({ isAdminMode: false, isAccessGranted: false });
  }
}));
