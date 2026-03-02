"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useFoodStore } from "@/lib/foodStore"
import { useCartStore } from "@/lib/store"
import type { FoodItem, Size } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { formatCurrency, formatImagePath } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<FoodItem | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [loading, setLoading] = useState(true)
  const allItems = useFoodStore((state) => state.items)
  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    setLoading(true)
    const foundItem = allItems.find((i) => i.id === params.id)
    if (foundItem) {
      setItem(foundItem)
      // Set initial selected size to the first one
      if (foundItem.sizes.length > 0) {
        setSelectedSize(foundItem.sizes[0])
      }
    }
    setLoading(false)
  }, [params.id, allItems])

  const handleAddToCart = () => {
    if (item && selectedSize) {
      addToCart({ ...item, quantity: 1, size: selectedSize.name })
      toast({
        title: "Added to cart",
        description: `${item.name} (${selectedSize.name}) has been added to your cart.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading product...</p>
      </div>
    )
  }

  if (!item) {
    // If you have a custom 404 page, Next.js will render it
    notFound()
    return null // notFound() doesn't abort rendering, so we must return null
  }
  
  const rawImage = selectedSize?.images[0] || item.sizes[0]?.images[0];
  const displayImage = formatImagePath(rawImage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={displayImage}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* You could add thumbnails for more images here if needed */}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground mt-2">{item.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <RadioGroup
              value={selectedSize?.name}
              onValueChange={(value) => {
                const newSize = item.sizes.find((s) => s.name === value)
                if (newSize) setSelectedSize(newSize)
              }}
              className="flex flex-col gap-2"
            >
              {item.sizes.map((size) => (
                <Label
                  key={size.name}
                  htmlFor={size.name}
                  className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-colors ${
                    selectedSize?.name === size.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className="font-medium">{size.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{formatCurrency(size.price)}</span>
                    <RadioGroupItem value={size.name} id={size.name} />
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
          
          <Separator />

          <div>
             <h2 className="text-lg font-semibold">Roast Level</h2>
             <p>{item.roastLevel}</p>
          </div>

          <Button onClick={handleAddToCart} size="lg" className="w-full">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
