"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { toast } from "./ui/toast";
import { updateOrderDetails } from "@/helper/order/action";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { transactionSchema } from "@/lib/validation";
import z from "zod";

type FormData = z.infer<typeof transactionSchema>;
export default function TransactionConfirmation({
  open,
  onOpenChange,
  orderId,
  onBack,
}: any) {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

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
    setScreenshot(data.url);

    // Save this URL in your DB
  };

  const handleConfirm = async () => {
    const data = {
      orderId: orderId,
      transactionId: transactionId,
      paymentImage: screenshot,
      nameOfSender: senderName,
    };
    const result = transactionSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        transactionId: fieldErrors.transactionId?.[0],
        nameOfSender: fieldErrors.nameOfSender?.[0],
      });

      return;
    }

    setErrors({});
    const response = await updateOrderDetails(data);

    if (response.success) {
      toast.add({
        type: "success",
        title: "Payment Submitted!",
        description: response.message,
      });

      onOpenChange(false);
      setTransactionId("");
      setScreenshot(null);
      setSenderName("");
      onBack(false);
      clearCart();
      router.push(`/order-received/${orderId}`);
    } else {
      toast.add({
        type: "error",
        title: "Payment Submission Failed!",
        description: response.message,
      });
    }
  };

  const handleBack = () => {
    onBack(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[calc(100%-24px)]
          sm:max-w-[565px]
          max-h-[92dvh]
          p-0 gap-0
          overflow-hidden
          rounded-xl
          border-none
          flex flex-col
        "
      >
        {/* Header */}
        <div className="bg-[#A1351B] text-white px-5 sm:px-7 py-6 shadow-md shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Monu Goras Bhandar
          </DialogTitle>

          <div className="mt-3 inline-flex bg-[#A1351B] px-4 py-2 text-sm font-semibold">
            Order ID: {orderId}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="border border-gray-200 p-5 sm:p-7 text-center">
            {/* Transaction ID */}
            <div className="my-3">
              <Label
                htmlFor="transactionId"
                className="text-base sm:text-lg font-semibold"
              >
                Enter 12-digit Transaction / UTR / Reference ID:
              </Label>

              <Input
                id="transactionId"
                type="text"
                inputMode="numeric"
                value={transactionId}
                onChange={(e) => {
                  setTransactionId(
                    e.target.value.replace(/\D/g, "").slice(0, 12),
                  );

                  setErrors((prev) => ({
                    ...prev,
                    transactionId: undefined,
                  }));
                }}
                className="
                  max-w-[307px]
                  h-14
                  mx-auto
                  text-center
                  text-lg
                  tracking-wider
                  mt-2
                "
                placeholder="Enter transactionId of payment"
              />
              {errors.transactionId && (
                <p className="text-red-500 text-xs">{errors.transactionId}</p>
              )}
            </div>

            {/* Sender name */}
            <div className="my-3">
              <Label
                htmlFor="sendername"
                className="text-base sm:text-lg font-semibold"
              >
                Enter your name on upi app
              </Label>

              <Input
                id="sendername"
                type="text"
                value={senderName}
                onChange={(e) => {
                  setSenderName(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    nameOfSender: undefined,
                  }));
                }}
                className="
                  max-w-[307px]
                  h-14
                  mx-auto
                  text-center
                  text-lg
                  tracking-wider
                  mt-2
                "
                placeholder="Ex: Jone wick"
              />
              {errors.nameOfSender && (
                <p className="text-red-500 text-xs">{errors.nameOfSender}</p>
              )}
            </div>

            {/* Screenshot Upload */}
            <div className="mt-7">
              <Label
                htmlFor="paymentScreenshot"
                className="text-base sm:text-lg font-semibold"
              >
                Upload Screenshot: <span className="text-red-500">*</span>
              </Label>

              <div className="flex flex-col items-center gap-3">
                <Input
                  id="paymentScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="
                    max-w-[300px]
                    cursor-pointer
                    file:cursor-pointer
                    file:mr-3
                    file:font-medium
                    mt-2
                  "
                />

                {screenshot && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    {/* <ImageIcon size={16} /> */}
                    {/* <span className="max-w-[220px] truncate">{screenshot}</span> */}

                    <img
                      className="w-20 md:w-32 h-20 md:h-32"
                      src={screenshot}
                      alt="payment image"
                    />

                    <button
                      type="button"
                      onClick={() => setScreenshot(null)}
                      className="text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <p className="mt-6 text-sm sm:text-base leading-7 text-gray-700">
              Click Confirm, only after amount deducted from your account. We
              will manually verify your transaction. Are you sure?
            </p>
          </div>
        </div>

        {/* Footer */}
        <Separator />

        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 shrink-0 bg-white">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className="text-base font-semibold px-1"
            disabled={loading}
          >
            Back
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="
              h-12 sm:h-[59px]
              px-6 sm:px-8
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-base
              font-semibold
              rounded-md
            "
          >
            {loading ? "Submitting..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
