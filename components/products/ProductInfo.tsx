import { Badge } from "@/components/ui/badge";
import type { Availability, Pricing, Product } from "../../data/productformat";

type ProductInfoProps = {
  product: Product;
  categoryName?: string | null;
  pricing: Pricing;
  availability: Availability;
};

export function ProductInfo({ product, categoryName, pricing, availability }: ProductInfoProps) {
  return (
    <div className="motion-safe:animate-in fade-in slide-in-from-bottom-2 delay-150 duration-700 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {categoryName && (
          <Badge variant="secondary" className="w-fit">
            {categoryName}
          </Badge>
        )}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
          {product.title}
        </h1>
        {product.description && (
          <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-4xl font-bold text-primary">{pricing.label}</span>
          {pricing.original && (
            <span className="text-lg text-muted-foreground line-through">{pricing.original}</span>
          )}
        </div>
        <p className={`flex items-center gap-2 text-sm font-medium ${availability.tone}`}>
          <availability.Icon className="size-4" />
          {availability.label}
        </p>
      </div>

      {product.remarks && (
        <p className="border-l-4 border-gold pl-4 leading-relaxed text-accent-foreground">
          {product.remarks}
        </p>
      )}

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}