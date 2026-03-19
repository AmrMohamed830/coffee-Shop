"use client";
import React, { useState } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PromoBannerForm() {
    const { promoTitle, promoSubtitle, setPromoText } = useAdminStore();
    const [title, setTitle] = useState(promoTitle);
    const [subtitle, setSubtitle] = useState(promoSubtitle);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPromoText(title, subtitle);
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
                    <Button type="submit">حفظ التغييرات</Button>
                </form>
            </CardContent>
        </Card>
    );
}
