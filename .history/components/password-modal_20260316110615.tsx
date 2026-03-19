"use client"
import React, { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/adminStore'
import { ShieldCheck } from 'lucide-react'

export function PasswordModal() {
  const { showPasswordModal, passwordError, handlePasswordSubmit, closeModal } = useAdminStore()
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (showPasswordModal) {
      setPassword('') // Reset password field when modal opens
    }
  }, [showPasswordModal])

  const handleSubmit = () => {
    handlePasswordSubmit(password)
  }

  if (!showPasswordModal) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in-50"
      onClick={closeModal}
    >
      <div
        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 text-center animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <ShieldCheck className="mx-auto text-blue-500 mb-4" size={48} />
        <h3 className="font-bold text-2xl mb-2 text-white">مطلوب التحقق</h3>
        <p className="text-sm text-gray-400 mb-6">
          لتفعيل وضع المسؤول والوصول الكامل، يرجى إدخال كلمة مرور حسابك.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="كلمة المرور"
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-center"
          autoFocus
        />
        {passwordError && (
          <p className="text-red-500 text-xs mt-3">{passwordError}</p>
        )}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={closeModal}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  )
}
