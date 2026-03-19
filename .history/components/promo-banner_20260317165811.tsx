import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
    return (
        <div className="relative overflow-hidden rounded-lg">
            <div className="relative aspect-[2.5/1] md:aspect-[3.5/1] w-full">
                <Image
                    src="/Gemini_Generated_Image_hcjixhhcjixhhcji.png"
                    alt="Special promotion"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#3e2000]/90 via-[#4d2201]/70 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 text-right" dir="rtl">
                <h1 className="text-2xl md:text-4xl font-bold max-w-md leading-tight text-white drop-shadow-md">
                    استمتع بخصم 20% على أول طلب!
                </h1>
                <p className="text-orange-100/90 mt-2 max-w-md drop-shadow">
                    استخدم كود "أهلاً20" عند الدفع للحصول على خصم خاص.
                </p>
                <div className="mt-4">
                    <Link href="/menu">
                        <Button asChild size="lg" className="bg-[#b8682b] hover:bg-[#904a17] text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg transition-transform hover:scale-105 border-none">
                            اطلب الآن
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
