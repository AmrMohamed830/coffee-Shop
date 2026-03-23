"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Loader2, X } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = "dfeisclog";
const CLOUDINARY_UPLOAD_PRESET = "coffee-shop";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "banners");

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("فشل رفع الصورة على Cloudinary");
    }

    const data = await response.json();
    return data.secure_url as string;
}

export function PromoBannerForm() {
    const { promoTitle, promoSubtitle, promoImage, isPromoVisible, setPromoText } = useAdminStore();
    const [title, setTitle] = useState(promoTitle);
    const [subtitle, setSubtitle] = useState(promoSubtitle);
    const [image, setImage] = useState(promoImage || '');
    const [isVisible, setIsVisible] = useState(isPromoVisible ?? true);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // مزامنة الحقول فور تحميل البيانات من فايربيز
    useEffect(() => {
        setTitle(promoTitle);
        setSubtitle(promoSubtitle);
        setImage(promoImage || '');
        setIsVisible(isPromoVisible ?? true);
    }, [promoTitle, promoSubtitle, promoImage, isPromoVisible]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await setPromoText(title, subtitle, image, isVisible);
            alert('تم تحديث البانر بنجاح لجميع العملاء!');
        } catch (error) {
            alert('حدث خطأ أثناء حفظ البانر. تأكد من اتصالك بالإنترنت.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setImage(localPreview);
        setIsUploading(true);

        try {
            const cloudinaryUrl = await uploadToCloudinary(file);
            setImage(cloudinaryUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            setImage(promoImage || '');
            alert("حدث خطأ أثناء رفع الصورة.");
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = () => {
        setImage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>تخصيص البانر الإعلاني</CardTitle>
                <CardDescription>
                    قم بتغيير النص الظاهر في البانر الإعلاني في الصفحة الرئيسية.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                        <input
                            type="checkbox"
                            id="promo-visible"
                            checked={isVisible}
                            onChange={(e) => setIsVisible(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-600 cursor-pointer"
                        />
                        <Label htmlFor="promo-visible" className="cursor-pointer text-base font-bold">تفعيل وإظهار البانر للعملاء</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="promo-title">العنوان الرئيسي</Label>
                        <Input
                            id="promo-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="مثال: خصم 20% على كل شيء!"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="promo-subtitle">النص الفرعي</Label>
                        <Input
                            id="promo-subtitle"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="مثال: استخدم كود SUMMER20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>صورة البانر (اختياري)</Label>
                        {image ? (
                            <div className="relative group w-full h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                                <img
                                    src={image}
                                    alt="Promo Banner"
                                    className="w-full h-full object-cover"
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                                {!isUploading && (
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">اضغط لرفع صورة من جهازك</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        )}
                    </div>
                    <Button type="submit" disabled={isUploading || isSaving}>
                        {isUploading ? "جاري الرفع..." : isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
