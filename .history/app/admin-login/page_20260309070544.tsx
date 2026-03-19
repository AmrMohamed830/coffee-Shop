"use client"
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useRouter } from "next/navigation";
import { Coffee, Lock, AlertCircle, ArrowRight, ArrowLeft, UserPlus, User, Trash2 } from "lucide-react";
import Link from "next/link";

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
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const router = useRouter();

    // جلب المستخدمين عند تحميل الصفحة
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const querySnapshot = await getDocs(usersCollection);
                const usersList = querySnapshot.docs.map(doc => doc.data() as UserProfile);
                
                // ترتيب المستخدمين: المشرفون أولاً ثم بالاسم
                usersList.sort((a, b) => {
                    if (a.role === b.role) return a.name.localeCompare(b.name);
                    return a.role === 'admin' ? -1 : 1;
                });
                
                setUsers(usersList);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("فشل في جلب قائمة المستخدمين. تأكد من الاتصال بالإنترنت.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (e: React.MouseEvent, userId: string, userName: string) => {
        e.stopPropagation();
        if (window.confirm(`هل أنت متأكد من حذف حساب ${userName} من القائمة؟`)) {
            try {
                await deleteDoc(doc(db, "users", userId));
                setUsers(users.filter(user => user.uid !== userId));
            } catch (err) {
                console.error("Error deleting user:", err);
                setError("حدث خطأ أثناء حذف المستخدم");
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setError("");
        setIsLoggingIn(true);
        try {
            // ضبط الجلسة لتنتهي بمجرد إغلاق المتصفح
            await setPersistence(auth, browserSessionPersistence);
            // تسجيل الدخول باستخدام الإيميل المخفي الخاص بالمستخدم المختار
            await signInWithEmailAndPassword(auth, selectedUser.email, password);
            router.push("/admin");
        } catch (err: any) {
            console.error("Login error:", err);
            setError("كلمة المرور غير صحيحة");
            setIsLoggingIn(false);
        } finally {
            // لا نوقف التحميل في حالة النجاح لأننا سننتقل لصفحة أخرى
            if (error) setIsLoggingIn(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // شاشة إدخال كلمة المرور (عند اختيار مستخدم)
    if (selectedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4" dir="rtl">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 relative">
                    <button 
                        onClick={() => { setSelectedUser(null); setError(''); setPassword(''); }} 
                        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition flex items-center gap-1 text-sm font-bold"
                    >
                        <ArrowLeft size={18} /> رجوع
                    </button>
                    
                    <div className="flex flex-col items-center mb-8 pt-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary text-3xl font-black shadow-sm">
                            {selectedUser.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-black dark:text-white">{selectedUser.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                            {selectedUser.role === 'admin' ? 'مشرف النظام' : 'موظف'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus className="block w-full pr-10 pl-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm transition-all" />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5" /> <p>{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={isLoggingIn} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-70 group shadow-lg shadow-primary/20">
                            {isLoggingIn ? <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div> : <>تسجيل الدخول <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // الشاشة الرئيسية: قائمة الحسابات
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4" dir="rtl">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"><Coffee className="w-8 h-8 text-primary" /></div>
                    <h2 className="text-2xl font-black text-black dark:text-white">مرحباً بك</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">اختر حسابك للمتابعة</p>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {users.length > 0 ? users.map(user => (
                        <div key={user.uid} className="relative group">
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl text-right transition-all border-2 border-transparent hover:border-primary hover:bg-primary/5 bg-gray-50 dark:bg-zinc-800/50"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${user.role === 'admin' ? 'bg-red-100 text-red-600 group-hover:bg-red-200' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-black dark:text-white text-lg">{user.name}</p>
                                    <p className={`text-xs font-bold ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                                        {user.role === 'admin' ? 'مشرف' : 'موظف'}
                                    </p>
                                </div>
                            </button>
                            <button
                                onClick={(e) => handleDeleteUser(e, user.uid, user.name)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="حذف الحساب"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-500">
                            <User size={48} className="mx-auto mb-2 opacity-20" />
                            <p>لا توجد حسابات مسجلة بعد</p>
                        </div>
                    )}
                </div>
                
                <div className="text-center pt-6 mt-6 border-t border-gray-200 dark:border-zinc-700">
                    <Link href="/admin-signup" className="inline-flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-bold hover:underline transition-all p-2 rounded-lg hover:bg-primary/5 w-full">
                        <UserPlus size={18} />
                        إضافة حساب جديد
                    </Link>
                </div>
            </div>
        </div>
    );
}