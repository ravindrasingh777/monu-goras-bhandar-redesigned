"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Ban, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { updateProductById } from "@/helper/product/action";
import { categoryItem } from "../../create/page";

export default function ProductClient({ productInfo,tagsData, categories }: any) {
  const [imageUrl, setImageUrl] = useState(productInfo.bannerImage ?? "");
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(productInfo.tags ?? []);
  const [available, setAvailable] = useState(productInfo.is_active ?? true);

  const [product, setProduct] = useState({
    title: productInfo.title ?? "",
    sku: productInfo.sku ?? "",
    is_active: productInfo.is_active ?? true,
    description: productInfo.description ?? "",
    stock: productInfo.stock ?? "",
    length: productInfo.length ?? "",
    width: productInfo.width ?? "",
    height: productInfo.height ?? "",
    tags: productInfo.tags ?? [],
    categoryId: productInfo.categoryId ?? "",
    bannerImage: productInfo.bannerImage ?? "",
    remarks: productInfo.remarks ?? "",
    price: productInfo.price ?? "",
    final_price: productInfo.final_price ?? "",
  });

  const router = useRouter();

  const handleTagChange = (tagName: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tagName] : prev.filter((tag) => tag !== tagName),
    );
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLoading(true);
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
    toast.add({
      type: "success",
      title: "Image uploaded successfully!",
      description: "The image has been uploaded successfully.",
    });
    setLoading(false);
    setImageUrl(data.url);

    // Save this URL in your DB
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
  setProduct((prev) => ({
    ...prev,
    categoryId: value,
  }));
};


  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      ...product,
      tags: selectedTags,
      bannerImage: imageUrl,
      is_active: available,
    };

    const result = await updateProductById(productInfo.id, payload);

    if (result?.success) {
      toast.add({
        type: "success",
        title: "Product updated successfully!",
        description: "Your product details have been saved.",
      });

      router.push("/admin/products");
      router.refresh();
    } else {
      toast.add({
        type: "error",
        title: "Update failed",
        description: result?.message ?? "Unable to update product.",
      });
    }
  } catch (error) {
    console.error("Product update error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full p-4 border border-gray-200">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Create New Product
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload an image and add the details for your Product.
          </p>
        </div>

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
              disabled={loading}
              accept="image/*"
              onChange={handleImageUpload}
              className="mx-auto block w-full cursor-pointer text-sm text-gray-600
          file:mr-4 file:rounded-lg file:border-0
          file:bg-blue-600 file:px-4 file:py-2
          file:text-sm file:font-semibold file:text-white
          hover:file:bg-blue-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              {loading ? "Uploading..." : "PNG, JPG, JPEG. Max 10MB"}
            </p>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-4 h-48 w-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>

        {/* Title & Sku */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 my-3">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              onChange={handleChange}
              value={product.title}
              placeholder="Enter post title"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="sku"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              sku
            </label>

            <input
              id="sku"
              type="text"
              name="sku"
              onChange={handleChange}
              value={product.sku}
              placeholder="Mtbook-phanton-60"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Price & Final price*/}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 my-3">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Price
            </label>

            <input
              id="price"
              type="text"
              name="price"
              onChange={handleChange}
              value={product.price}
              placeholder="Enter product price without discount"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="final_price"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Final Price
            </label>

            <input
              id="final_price"
              type="text"
              name="final_price"
              onChange={handleChange}
              value={product.final_price}
              placeholder="Enter product price after discount"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Remarks & Stocks */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-3">
          <div>
            <label
              htmlFor="remarks"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Remarks
            </label>

            <input
              id="remarks"
              type="text"
              name="remarks"
              onChange={handleChange}
              value={product.remarks}
              placeholder="Enter remarks"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Stock
            </label>

            <input
              id="stock"
              type="text"
              name="stock"
              onChange={handleChange}
              value={product.stock}
              placeholder="Enter available stock"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* tags & available for sale */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-3">
          <div>
            <label
              htmlFor="tags"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Tags
            </label>

            <Popover>
              <PopoverTrigger className="w-full py-1 rounded-xl px-3 border border-gray-300">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full bg-white hover:bg-white outline-none justify-start font-normal"
                >
                  {selectedTags.length > 0
                    ? `${selectedTags.length} tags selected`
                    : "Select tags"}
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <div className="mb-2 text-sm font-semibold">Tags</div>

                <div className="space-y-2">
                  {tagsData?.map((tag: any) => (
                    <label
                      key={tag.id}
                      className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-accent"
                    >
                      <Checkbox
                        checked={selectedTags.includes(tag.name)}
                        onCheckedChange={(checked) =>
                          handleTagChange(tag.name, checked === true)
                        }
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Categories
            </label>

            <select
              id="categoryId"
              name="categoryId"
              value={product.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                Select a category
              </option>

              {categories?.map((item: categoryItem) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* length , Breath , height */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 mb-3">
          <div>
            <label
              htmlFor="length"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Length
            </label>

            <input
              id="length"
              type="text"
              name="length"
              onChange={handleChange}
              value={product.length}
              placeholder="Enter product length"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="width"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Width
            </label>

            <input
              id="width"
              type="text"
              name="width"
              onChange={handleChange}
              value={product.width}
              placeholder="Enter product width"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="height"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Height
            </label>

            <input
              id="height"
              type="text"
              name="height"
              onChange={handleChange}
              value={product.height}
              placeholder="Enter product height"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

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
            onPressedChange={(checked) => {
              setAvailable(checked);

              setProduct((prev) => ({
                ...prev,
                is_active: checked,
              }));
            }}
            aria-label="Toggle product availability"
            variant="outline"
            value={product.is_active}
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

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            value={product.description}
            rows={5}
            placeholder="Write a short description..."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl mb-2 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Saving..." : "Save product"}
        </button>
        <button
          className="w-full rounded-xl px-5 py-3 bg-black text-sm font-semibold text-white shadow-md"
          type="button"
          onClick={() => router.push("/admin/products")}
        >
          Back
        </button>
      </form>
    </div>
  );
}
