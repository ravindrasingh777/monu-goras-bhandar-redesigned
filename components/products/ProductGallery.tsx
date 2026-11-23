"use client";

import Image from "next/image";
import { useState } from "react";
import { Milk } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Availability, Product } from "../../data/productformat";

// Extra gallery shots until a DB field exists. Paths are relative to /public.
// A path that fails to load is dropped from the thumbnail strip automatically.
const STATIC_GALLERY_IMAGES: string[] = [
  "/herosection.png",
  "/herosection2.png",
  "/herosectionImage.png",
];

type ProductGalleryProps = {
  product: Product;
  discount: number;
  availability: Availability;
};

export function ProductGallery({ product, discount, availability }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [broken, setBroken] = useState<string[]>([]);

  const images = Array.from(new Set([product.bannerImage, ...STATIC_GALLERY_IMAGES])).filter(
    (src): src is string => !!src && !broken.includes(src),
  );
  const current = Math.min(activeIndex, images.length - 1);
  const activeSrc = images[current];

  const markBroken = (src: string) => setBroken((list) => [...list, src]);

  return (
    <div className="flex flex-col gap-3 lg:h-[30rem] lg:flex-row-reverse lg:gap-4">
      <figure className="relative h-96 w-full overflow-hidden rounded-xl bg-secondary lg:h-full lg:flex-1">
        {activeSrc ? (
          <div key={activeSrc} className="absolute inset-0 motion-safe:animate-in fade-in duration-300">
            <Image
              src={activeSrc}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              onError={() => markBroken(activeSrc)}
            />
          </div>
        ) : (
          <div className="grid h-full place-items-center bg-accent">
            <Milk className="size-28 text-primary/40" strokeWidth={1.25} />
          </div>
        )}

        {discount > 0 && (
          <Badge className="absolute left-4 top-4 bg-gold px-3 py-1 text-sm font-bold text-foreground">
            {discount}% off
          </Badge>
        )}

        {!availability.purchasable && (
          <p className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-background text-red-500 border border-red-500 px-5 py-2 text-sm font-semibold shadow-md">
            {availability.label}
          </p>
        )}
      </figure>

      {images.length > 1 && (
        <div
          role="group"
          aria-label="Product images"
          className="flex gap-3 overflow-x-auto pb-1 lg:w-24 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0"
        >
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === current}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square w-20 shrink-0 rounded-xl border-2 bg-card p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring lg:w-full ${
                index === current ? "border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <span className="relative block h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  onError={() => markBroken(src)}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}