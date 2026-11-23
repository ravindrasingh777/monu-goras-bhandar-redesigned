"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { createCategory, updateCategory } from "@/helper/category/action";
import { Ban, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CategoryModel({ categoryDetails, open, onClose }: any) {
    const router = useRouter();
  const [category, setCategory] = useState({
    name: categoryDetails?.name ?? "",
    slug: categoryDetails?.slug ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(categoryDetails?.bannerImage ?? "");
  const [available, setAvailable] = useState(categoryDetails?.is_active ?? true);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploading(true);
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    console.log("Image URL:", data.url);
    toast.add({
      type: "success",
      title: "Image uploaded successfully!",
      description: "The image has been uploaded successfully.",
    });
    setUploading(false);
    setImageUrl(data.url);

    // Save this URL in your DB
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCategory((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: any) => {
    console.log("buttn db");
    e.preventDefault();

    try {
      setLoading(true);
      const data = {
        name: category.name,
        slug: category.slug,
        bannerImage: imageUrl,
        is_active: available,
      };

      if (categoryDetails) {
        const response = await updateCategory(categoryDetails.id, data);
        if (response.success) {
          toast.add({
            type: "success",
            title: "Category updated!",
            description: `The category ${data.name} is updated successfully.`,
          });
          e.target.reset();
          setImageUrl("");
          setAvailable(true);
          onClose();
          router.refresh()
        } else {
          toast.add({
            type: "error",
            title: "Category update failed!",
            description: "Unable to update category.",
          });
        }
      } else {
        const response = await createCategory(data);
        if (response.status == 201) {
          toast.add({
            type: "success",
            title: "Category created!",
            description: `The category ${data.name} is created successfully.`,
          });
          e.target.reset();
          onClose()
          router.refresh()
        } else {
          toast.add({
            type: "error",
            title: "Category creation failed!",
            description: "Unable to create category.",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.add({
        type: "error",
        title: "Category creation failed!",
        description: "Internal server error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {categoryDetails ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          {/* Image Upload */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Featured Image
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <input
                id="image"
                type="file"
                disabled={uploading}
                accept="image/*"
                onChange={handleImageUpload}
                className="mx-auto block w-full cursor-pointer text-sm text-gray-600
          file:mr-4 file:rounded-lg file:border-0
          file:bg-blue-600 file:px-4 file:py-2
          file:text-sm file:font-semibold file:text-white
          hover:file:bg-blue-700"
              />

              <p className="mt-2 text-xs text-gray-500">
                {uploading ? "Uploading..." : "PNG, JPG, JPEG. Max 10MB"}
              </p>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="mt-4 h-20 w-20 rounded-lg object-cover"
                />
              )}
            </div>
          </div>
          <form id="category-form" onSubmit={submitHandler}>
            <Field className="mb-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Enter category name"
                value={category.name}
                onChange={handleChangeValue}
              />
            </Field>
            <Field>
              <Label htmlFor="username-1">Slug</Label>
              <Input
                id="username-1"
                name="slug"
                value={category.slug}
                onChange={handleChangeValue}
                placeholder="Ex: organic-ghee"
              />
            </Field>
          </form>
          {/* available to sell */}
          <div className="my-4">
            <label
              htmlFor="is_available"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Available For Sell
            </label>

            <Toggle
              pressed={available}
              onPressedChange={setAvailable}
              aria-label="Toggle product availability"
              variant="outline"
              className={`
        gap-2 rounded-full border px-4 py-2
        transition-all duration-300
        ${
          available
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
        }
      `}
            >
              {available ? (
                <ShoppingCart className="size-4" />
              ) : (
                <Ban className="size-4" />
              )}

              <span className="font-semibold">
                {available ? "Active" : "Unactive"}
              </span>
            </Toggle>
          </div>
        </FieldGroup>
        <DialogFooter>
          <DialogClose
            onClick={onClose}
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            className={`${loading && "opacity-20"}`}
            type="submit"
            form="category-form"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
