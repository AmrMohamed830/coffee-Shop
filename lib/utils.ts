import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatImagePath(src: string | undefined | null): string {
  if (!src) {
    return "/placeholder.svg";
  }

  // The input value might be a full local path like "C:\Users\...\image.png"
  // or a simple path like /image.png. We need to extract just the filename
  // and ensure it starts with a leading slash.
  let imagePath = src.replace(/"/g, ''); // Remove quotes that might be added
  
  // Split the path by both forward and back slashes to get path segments
  const parts = imagePath.split(/[\\\/]/);
  
  // The filename will be the last part of the path
  const filename = parts[parts.length - 1];

  if (!filename) {
    return "/placeholder.svg";
  }

  return `/${filename}`;
}
