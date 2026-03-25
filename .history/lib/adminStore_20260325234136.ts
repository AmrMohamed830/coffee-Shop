"use client"
import { create } from "zustand";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, onSnapshot, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

interface AdminState {
  isAdminMode: boolean;
  isAccessGranted: boolean;
  showPasswordModal: boolean;
  passwordError: string;
  userProfile: User | null;
  banners: any[];
  isBannersLoading: boolean;
  listenToBanners: () => () => void;
  addBanner: (bannerData: any) => Promise<void>;
  updateBanner: (id: string, bannerData: any) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
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
  banners: [],
  isBannersLoading: true,

  addBanner: async (bannerData) => {
    try {
      await addDoc(collection(db, 'banners'), bannerData);
    } catch (error) {
      console.error("Error adding banner:", error);
      throw error;
    }
  },

  updateBanner: async (id, bannerData) => {
    try {
      await updateDoc(doc(db, 'banners', id), bannerData);
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  },

  deleteBanner: async (id) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  },

  listenToBanners: () => {
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const bannersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ banners: bannersList, isBannersLoading: false });
    }, (error) => {
        console.error("Error fetching banners:", error);
        set({ isBannersLoading: false });
    });
    return unsubscribe;
  },

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
    // نجلب المستخدم مباشرة من Firebase كحل بديل لو الذاكرة أتمسحت بسبب الـ Refresh
    const currentUser = userProfile || auth.currentUser;

    if (!password) {
        set({ passwordError: "الرجاء إدخال كلمة المرور." });
        return;
    }

    if (!currentUser || !currentUser.email) {
        set({ passwordError: "لا يمكن التحقق من المستخدم الحالي." });
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, currentUser.email, password);
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
