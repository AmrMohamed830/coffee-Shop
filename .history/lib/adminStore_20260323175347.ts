"use client"
import { create } from "zustand";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

interface AdminState {
  isAdminMode: boolean;
  isAccessGranted: boolean;
  showPasswordModal: boolean;
  passwordError: string;
  userProfile: User | null;
  promoTitle: string;
  promoSubtitle: string;
  promoImage: string;
  isPromoVisible: boolean;
  listenToPromoBanner: () => () => void;
  initAuthListener: () => () => void;
  toggleAdminMode: () => void;
  handlePasswordSubmit: (password: string) => Promise<void>;
  closeModal: () => void;
  logout: () => void;
  setPromoText: (title: string, subtitle: string, image: string, isVisible: boolean) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdminMode: false,
  isAccessGranted: false,
  showPasswordModal: false,
  passwordError: '',
  userProfile: null,
  promoTitle: "استمتع بخصم 20% على أول طلب!",
  promoSubtitle: "استخدم كود \"أهلاً20\" عند الدفع للحصول على خصم خاص.",
  promoImage: "",
  isPromoVisible: true,

  setPromoText: async (title: string, subtitle: string, image: string, isVisible: boolean) => {
    try {
      await setDoc(doc(db, 'settings', 'promoBanner'), { title, subtitle, image, isVisible });
      set({ promoTitle: title, promoSubtitle: subtitle, promoImage: image, isPromoVisible: isVisible });
    } catch (error) {
      console.error("Error saving promo banner to Firebase:", error);
      throw error;
    }
  },

  listenToPromoBanner: () => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'promoBanner'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          promoTitle: data.title ?? "استمتع بخصم 20% على أول طلب!",
          promoSubtitle: data.subtitle ?? "استخدم كود \"أهلاً20\" عند الدفع للحصول على خصم خاص.",
          promoImage: data.image ?? "",
          isPromoVisible: data.isVisible ?? true
        });
      }
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
