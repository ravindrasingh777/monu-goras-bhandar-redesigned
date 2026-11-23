
import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import AddToCartButton from "../AddToCartButton";

export default function ProductCard({ product }:any) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(product.final_price ?? product.price ?? 0));

  return (
    <Link
      href={`/product/${product.id}`}
    >
      <article className="group flex h-full flex-col rounded-[30px] border border-[#eee9e6] bg-white p-[18px] transition-shadow duration-300 hover:shadow-lg">

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#faf4ef]">
        {product.bannerImage?.trim() ? (
          <>
            <Image
              src={product.bannerImage}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute top-2 left-2">
              {product.remarks?.trim() && (
                <Badge className={`text-sm text-white ${product.remarks === "OUT OF STOCK" &&  "bg-red-500"}`}>{product.remarks}</Badge>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="line-clamp-2 text-[22px] font-normal leading-snug tracking-wide text-[#171717]">
          {product.title}
        </h3>

        {/* Price */}
        <p className="mt-3 text-lg font-normal tracking-wide text-[#171717]">
          From{" "}
          <span className="ml-1 font-medium">
            {formattedPrice}{" "}
            <span className="text-base text-red-600 line-through">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              }).format(Number(product.price))}
            </span>
          </span>
        </p>

        <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-xs font-medium text-green-700">
            Available · {product.stock} in stock
          </p>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />
      </div>
    </article>
    </Link>
  );
}
