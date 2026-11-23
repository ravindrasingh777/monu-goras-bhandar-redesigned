import ProductCard from "@/components/products/product-card";

export default function ProductListing({ products }: any) {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products?.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <h1 className="font-medium">No products found.</h1>
        )}
      </div>
    </div>
  );
}






