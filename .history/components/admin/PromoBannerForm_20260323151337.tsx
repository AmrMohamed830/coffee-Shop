"use client";
import React, { useState } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PromoBannerForm() {
    const { promoTitle, promoSubtitle, promoImage, setPromoText } = useAdminStore();
    const [title, setTitle] = useState(promoTitle);
    const [subtitle, setSubtitle] = useState(promoSubtitle);
    const [image, setImage] = useState(promoImage || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPromoText(title, subtitle, image);
        alert('تم تحديث البانر بنجاح!');
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
                        <Label htmlFor="promo-image">رابط الصورة (اختياري)</Label>
                        <Input
                            id="promo-image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="مثال: https://example.com/banner.png"
                            dir="ltr"
                        />
                    </div>
                    <Button type="submit">حفظ التغييرات</Button>
                </form>
            </CardContent>
        </Card>
    );
}
