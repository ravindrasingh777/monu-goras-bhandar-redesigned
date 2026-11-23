"use client";
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

import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import CategoryModel from "./CategoryModel";

export default function CategoryTable({ categories }: any) {
  const [openModel, setOpenModel] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);

  const handleOpenModel = (category: any) => {
    setOpenModel(true);
    setCategoryDetails(category);
  };

  const handleAddCategory = () => {
    console.log("button db")
    setCategoryDetails(null);
    setOpenModel(true);
  };

  return (
    <>
      {openModel && (
        <CategoryModel
          categoryDetails={categoryDetails}
          open={openModel}
          onClose={() => setOpenModel(false)}
        />
      )}

      <div className="w-full space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor your store categories.
          </p>
        </div>

        <div className="w-full flex items-center justify-end">
          <Button type="button" className="cursor-pointer" onClick={handleAddCategory}>
            Add Category
          </Button>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories?.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex min-w-[220px] items-center gap-3">
                      <img
                        src={category.bannerImage}
                        alt={category.name}
                        className="h-12 w-12 rounded-lg border object-cover"
                      />

                      <div className="min-w-0">
                        <p className="font-medium">{category.name}</p>
                        <p className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {category.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={category.is_active ? "default" : "secondary"}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleOpenModel(category)}
                        variant="outline"
                        className="cursor-pointer"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="outline"
                        className="cursor-pointer text-red-500"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {categories?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No category found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
