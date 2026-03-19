"use client"
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useRouter } from "next/navigation";
import { Coffee, Lock, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

// تعريف نوع لملف المستخدم لضمان التناسق
interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
}

export default function AdminLogin() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true); // البدء بالتحميل لجلب المستخدمين
    const router = useRouter();

    // جلب كل المستخدمين عند تحميل الصفحة
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                // تعديل: جلب البيانات بدون ترتيب معقد لتجنب أخطاء الفهرسة (Missing Index)
                const querySnapshot = await getDocs(usersCollection);
                const usersList = querySnapshot.docs.map(doc => doc.data() as UserProfile);
                
                // ترتيب المستخدمين محلياً: المشرفون أولاً ثم بالاسم
                usersList.sort((a, b) => {
                    if (a.role === b.role) return a.name.localeCompare(b.name);
                    return a.role === 'admin' ? -1 : 1;
                });
                
                setUsers(usersList);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("فشل في جلب قائمة المستخدمين.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;

        setError("");
        setIsLoading(true);
        try {
            // ضبط الاستمرارية لتكون للجلسة فقط (يطلب الباسورد عند غلق المتصفح)
            await setPersistence(auth, browserSessionPersistence);
            await signInWithEmailAndPassword(auth, selectedUser.email, password);
            router.push("/admin");
        } catch (err: any) {
            let errorMessage = "حدث خطأ غير متوقع.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errorMessage = "كلمة المرور غير صحيحة.";
            }
            console.error("Login Error:", err.code);
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // شاشة إدخال كلمة المرور بعد اختيار المستخدم
    if (selectedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4" dir="rtl">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 relative">
                    <button onClick={() => { setSelectedUser(null); setError(''); setPassword(''); }} className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition flex items-center gap-1">
                        <ArrowLeft size={16} /> الرجوع
                    </button>
                    <div className="flex flex-col items-center mb-8 pt-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary text-2xl font-bold">
                            {selectedUser.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-black dark:text-white">{selectedUser.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">أدخل كلمة المرور للمتابعة</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus className="block w-full pr-10 pl-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm" />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                                <AlertCircle className="w-5 h-5" /> <p>{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-70 group">
                            {isLoading ? <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div> : <>تسجيل الدخول <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4" dir="rtl">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"><Coffee className="w-8 h-8 text-primary" /></div>
                    <h2 className="text-2xl font-black text-black dark:text-white">اختر حسابك</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">حدد حسابك لتسجيل الدخول</p>
                </div>

                {/* عرض رسالة الخطأ في القائمة الرئيسية إن وجدت */}
                {error && (
                    <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                        <AlertCircle className="w-5 h-5" /> <p>{error}</p>
                    </div>
                )}

                <div className="space-y-3">
                    {users.map(user => (
                        <button
                            key={user.uid}
                            onClick={() => setSelectedUser(user)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl text-right transition-all border-2 border-transparent hover:border-primary hover:bg-primary/5"
                        >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-black dark:text-white">{user.name}</p>
                                <p className={`text-xs font-medium ${user.role === 'admin' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {user.role === 'admin' ? 'مشرف' : 'موظف'}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
                
                <div className="text-center text-sm pt-6 mt-6 border-t border-gray-200 dark:border-zinc-700">
                    <Link href="/admin-signup" className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">
                        أو إنشاء حساب مسؤول جديد
                    </Link>
                </div>
            </div>
        </div>
    );
}
