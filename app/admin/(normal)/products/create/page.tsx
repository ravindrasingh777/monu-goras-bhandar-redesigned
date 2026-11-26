"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getAllTags } from "@/helper/tags/action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Ban, ShoppingCart } from "lucide-react";
import { createProduct } from "@/helper/product/action";
import { getAllCategories } from "@/helper/category/action";

export interface tagItem {
  name: string;
  id: string;
}

export interface categoryItem {
  name: string;
  id: string;
}

const Page = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<tagItem[]>([]);
  const [categories,setCategories]=useState<categoryItem[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagData , categoryData] = await Promise.all([
          getAllTags(),
          getAllCategories(),
        ]);
        setTags(tagData ?? []);
        setCategories(categoryData ?? []);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchData();
  }, []);

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

  const submitHandler = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = {
        title: e.target.title.value,
        category: e.target.category.value,
        sku: e.target.sku.value,
        is_active: available,
        description: e.target.description.value,
        stock: e.target.stock.value,
        length: e.target.length.value,
        width: e.target.width.value,
        height: e.target.height.value,
        tags: selectedTags,
        bannerImage: imageUrl,
        remarks: e.target.remarks.value,
        price: e.target.price.value,
        final_price: e.target.final_price.value,
      };

      const response = await createProduct(data);
      if (response.status == 201) {
        toast.add({
          type: "success",
          title: "Product created!",
          description: `The product ${data.title} is created successfully.`,
        });
        e.target.reset();
        setImageUrl("");
        setAvailable(true);
        setLoading(false);
        setSelectedTags([]);
        router.push("/admin/products")
      } else {
        toast.add({
          type: "error",
          title: "Product creation failed!",
          description: "Unable to create product.",
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.add({
        type: "error",
        title: "Error creating product",
        description: "There was an error creating the product.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full p-4 border border-gray-200">
      <form onSubmit={submitHandler} className="w-full">
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
              placeholder="Enter available stock"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* tags & categories */}
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
                  {tags?.map((tag) => (
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

              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Categories
                </label>

                <select
                  id="category"
                  name="category"
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
          {loading ? "Creating..." : "Create product"}
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
};

export default Page;
