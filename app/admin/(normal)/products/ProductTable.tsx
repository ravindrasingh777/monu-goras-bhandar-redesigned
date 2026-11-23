"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";

export default function ProductTable({ products }: any) {
  const router = useRouter();
  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Products</h2>
        <p className="text-sm text-muted-foreground">
          Manage and monitor your store products.
        </p>
      </div>

      <div className="w-full flex items-center justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/admin/products/create")}
        >
          Add Product
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products?.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex min-w-[220px] items-center gap-3">
                    <img
                      src={product.bannerImage}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />

                    <div className="min-w-0">
                      <p className="font-medium">{product.title}</p>
                      <p className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <div className="font-medium">
                    ₹{Number(product.final_price).toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-muted-foreground line-through">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <div className="font-medium">{product.category}</div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={product.stock > 0 ? "secondary" : "destructive"}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(product.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button onClick={()=> router.push(`/admin/products/edit/${product.id}`)} variant="outline" className="cursor-pointer">
                      <Pencil />
                    </Button>
                    <Button variant="outline" className="cursor-pointer text-red-500">
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {products?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
