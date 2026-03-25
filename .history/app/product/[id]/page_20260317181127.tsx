"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useOrderStore } from "@/lib/orderStore"
import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatImagePath } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import type { Product, Size } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { products, initListener, initialized } = useOrderStore()
  const { addToCart } = useCartStore()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [loading, setLoading] = useState(true)

  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  useEffect(() => {
    if (products.length > 0 && productId) {
      const foundProduct = products.find((p) => p.id === productId);

      if (foundProduct && foundProduct.sizes && typeof foundProduct.sizes === 'object' && !Array.isArray(foundProduct.sizes)) {
        // Transform the sizes object into an array of Size objects
        const transformedSizes: Size[] = Object.entries(foundProduct.sizes)
          .map(([name, sizeData]: [string, any]) => ({
            name: name as "50g" | "100g" | "250g",
            price: sizeData.price,
            images: [sizeData.image], // The type expects an array of strings
          }))
          .sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Sort by gram value

        if (transformedSizes.length > 0) {
          // Create a new product object with the transformed sizes array
          const productWithTransformedSizes = {
            ...foundProduct,
            sizes: transformedSizes,
          };
          setProduct(productWithTransformedSizes);
          setSelectedSize(transformedSizes[0]);
        }
      }
      setLoading(false);
    }
  }, [products, productId]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart({
        ...product, // Pass all product properties to the cart item
        price: selectedSize.price, // Override with the selected size's price
        size: selectedSize.name,   // Set the selected size name
        quantity: 1,
      });

      toast({
        title: "تمت الإضافة إلى السلة",
        description: `${product.name} (${selectedSize.name})`,
        variant: "success",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product || !selectedSize) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold">Product not found or not available</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // The image is now in an array, so we get the first element.
  const displayImage = selectedSize.images[0] ?? product.image;

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={formatImagePath(displayImage)}
            alt={product.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="flex flex-col justify-center" dir="rtl">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.category}</p>
          
          <p className="text-3xl font-bold my-4">{formatCurrency(selectedSize?.price ?? 0)}</p>

          <div>
            <h3 className="text-sm font-semibold mb-2">الحجم</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size.name}
                  variant={selectedSize?.name === size.name ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="flex-1 md:flex-auto"
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              أضف إلى السلة
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
