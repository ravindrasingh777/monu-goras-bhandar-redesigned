import Link from "next/link";
import {CardContent } from "../ui/card";
import Image from "next/image";

export default function CategoryCard({ category }: any) {
  return (
    <>
      <Link href={`/our-products/${category.slug}`}>
        <div className="group mx-auto w-full max-w-[420px] overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-none transition-shadow duration-300 hover:shadow-lg">
          {/* Product Image */}
          <div className="relative w-full h-80 bg-[#f8f2eb]">
            <Image
              src={category?.bannerImage}
              alt={category?.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Title */}
          <CardContent className="flex items-center justify-center py-3">
            <h2 className="text-center text-lg font-normal tracking-wide text-[#1F1F1F] sm:text-xl">
              {category?.name}
            </h2>
          </CardContent>
        </div>
      </Link>
    </>
  );
}
