"use client"

import React, { useEffect } from 'react'
import { useAdminStore } from '@/lib/adminStore'
import { useOrderStore } from '@/lib/orderStore'
import { PasswordModal } from './password-modal'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Initialize Auth
    const unsubscribeAuth = useAdminStore.getState().initAuthListener();
    
    // 2. Initialize Promo Banner
    const unsubscribeBanner = useAdminStore.getState().listenToPromoBanner();

    // 3. Initialize Products & Orders
    useOrderStore.getState().initListener();
    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeBanner) unsubscribeBanner();
      // products listener is global and usually doesn't need cleanup in this specific architecture 
      // but if we had a products unsubscribe, we'd call it here.
    };
  }, []);

  return (
    <>
      {children}
      <PasswordModal />
    </>
  )
}
