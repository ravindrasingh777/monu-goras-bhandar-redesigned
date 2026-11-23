"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CategoryListing({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => router.push("/our-products")}
        variant={`${pathname === "/our-products"
            ? "default" : "outline"}`}
        className={`rounded-full border px-3 py-1.5 text-sm ${
          pathname === "/our-products"
            && " text-white"
        }`}
      >
        All Products
      </Button>

      {categories?.map((category) => {
        const href = `/our-products/${category.slug}`;
        const isActive = pathname === href;

        return (
          <Button
            key={category.id}
            variant="outline"
            onClick={() => router.push(href)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              isActive ? "bg-[#A1351B] hover:bg-[#A1351B] hover:text-white text-white" : ""
            }`}
          >
            {category.name}
          </Button>
        );
      })}
    </div>
  );
}