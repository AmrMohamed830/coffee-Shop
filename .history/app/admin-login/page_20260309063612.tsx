"use client"
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { Coffee, Lock, AlertCircle, User, UserCog, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminSignup() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'admin' | 'staff'>('staff'); // staff is the default role
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            // توليد بريد إلكتروني تلقائي في الخلفية لربطه بالنظام (المستخدم لا يحتاج لمعرفته)
            // نستخدم الوقت الحالي لضمان عدم تكرار الإيميل حتى لو تكرر الاسم
            const generatedEmail = `${name.trim().replace(/\s+/g, '.')}.${Date.now()}@admin.local`;
            const userCredential = await createUserWithEmailAndPassword(auth, generatedEmail, password);
            const user = userCredential.user;

            // Save user name and role to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: generatedEmail, // نحفظ الإيميل المولد لنستخدمه في تسجيل الدخول لاحقاً
                role: role,
            });

            // تعديل: استخدام replace لتجنب مشاكل التوجيه وضمان تحديث الصفحة
            router.replace("/admin"); 
        } catch (err: any) {
            console.error(err);
            setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4" dir="rtl">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <Coffee className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-black dark:text-white">إنشاء حساب مسؤول</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">أدخل بياناتك لإنشاء حساب جديد</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الاسم</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                                <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full pr-10 pl-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm" />
                            </div>
                        </div>
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="block w-full pr-10 pl-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm" />
                            </div>
                            <p className="text-xs text-gray-500">يجب أن تكون 6 أحرف على الأقل.</p>
                        </div>
                        {/* Role Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الصلاحية</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><UserCog className="h-5 w-5 text-gray-400" /></div>
                                <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'staff')} className="block w-full appearance-none pr-10 pl-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm">
                                    <option value="staff">موظف (Staff)</option>
                                    <option value="admin">مشرف (Admin)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                            <AlertCircle className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-70 group">
                        {isLoading ? <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div> : <>إنشاء الحساب <UserPlus className="w-5 h-5" /></>}
                    </button>
                </form>
                <div className="text-center text-sm pt-4">
                    <Link href="/admin-login" className="text-blue-600 hover:underline font-medium">
                        لديك حساب بالفعل؟ تسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    );
}