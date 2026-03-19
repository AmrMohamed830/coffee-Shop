"use client"

import React, { useEffect } from 'react'
import { useAdminStore } from '@/lib/adminStore'
import { PasswordModal } from './password-modal'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the authentication listener from the admin store
    // const unsubscribe = useAdminStore.getState().initAuthListener(); // تم الإيقاف مؤقتاً لتجنب رسالة الخطأ
    
    // Cleanup the listener when the component unmounts
    return () => {
      // if (unsubscribe) {
      //   unsubscribe();
      // }
    };
  }, []);

  return (
    <>
      {children}
      {/* <PasswordModal /> */} {/* تم الإخفاء للدخول بدون باسورد */}
    </>
  )
}
