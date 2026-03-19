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
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 text-right" dir="rtl">
                <h1 className="text-2xl md:text-4xl font-bold max-w-md leading-tight">
                    استمتع بخصم 20% على أول طلب!
                </h1>
                <p className="text-muted-foreground mt-2 max-w-md">
                    استخدم كود "أهلاً20" عند الدفع للحصول على خصم خاص.
                </p>
                <div className="mt-4">
                    <Link href="/menu">
                        <Button asChild size="lg">
                            اطلب الآن
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
