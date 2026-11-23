"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteOrder } from "@/helper/order/action";
import { toast } from "./ui/toast";
import TransactionConfirmation from "./TransactionConfirmation";

const PaymentDialog = ({
  open,
  onOpenChange,
  orderId,
  amount,
  upiId,
  merchantName,
}: any) => {
  const [openTransactionModel, setOpenTransactionModel] = useState(false);
  // Generate UPI payment QR data
  const qrValue = useMemo(() => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      merchantName,
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;
  }, [upiId, merchantName, amount, orderId]);

  const handleCancelPayment = async () => {
    const response = await deleteOrder(orderId);

    if (response.success) {
      onOpenChange(false);

      toast.add({
        type: "warning",
        title: "Payment Canceled!",
        description: "Your payment has been canceled successfully.",
      });
    }
  };

  return (
    <>
      {
        <TransactionConfirmation
          open={openTransactionModel}
          onOpenChange={setOpenTransactionModel}
          orderId={orderId}
          onBack={onOpenChange}
        />
      }
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="
          w-[calc(100%-24px)]
          sm:max-w-[565px]
          max-h-[92dvh]
          p-0 gap-0
          overflow-hidden
          rounded-xl
          border-none
          flex flex-col
          [&>button]:text-white
          [&>button]:opacity-80
          [&>button]:hover:opacity-100
        "
        >
          {/* Header */}
          <div className="bg-[#A1351B] text-white px-5 sm:px-7 py-5 shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {merchantName}
            </DialogTitle>

            <div className="mt-3 inline-flex items-center bg-[#A1351B] px-4 py-2 text-sm font-semibold">
              Order ID: {orderId}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="border border-gray-200 p-4 sm:p-6 flex flex-col items-center text-center">
              {/* QR Code */}
              <div className="border border-gray-300 p-2 sm:p-3">
                <QRCodeSVG
                  value={qrValue}
                  size={250}
                  level="H"
                  includeMargin={false}
                  className="w-[190px] h-[190px] sm:w-[250px] sm:h-[250px]"
                />
              </div>

              {/* UPI ID */}
              <div className="mt-3 bg-gray-100 px-4 py-2 text-sm sm:text-base font-medium text-gray-700">
                {upiId}
              </div>

              {/* Instructions */}
              <p className="mt-5 text-sm sm:text-base leading-7 text-gray-600">
                Scan the QR Code with any UPI apps like BHIM, Paytm, Google Pay,
                PhonePe or any Banking UPI app to make payment for this order.
                After successful payment, enter the UPI Reference ID or
                Transaction Number and your UPI ID in the next screen and submit
                the form. We will manually verify this payment against your
                12-digits UPI Reference ID or Transaction Number (e.g.
                301422121258) and your UPI ID.
              </p>

              {/* UPI Apps */}
              <div className="mt-5 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                <span className="font-bold text-sm text-blue-700">
                  Google Pay
                </span>

                <span className="font-bold text-sm text-purple-700">
                  PhonePe
                </span>

                <span className="font-bold text-sm text-blue-800">Paytm</span>

                <span className="font-bold text-sm text-green-700">BHIM</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <Separator />

          <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 bg-white shrink-0">
            <div className="text-xl sm:text-3xl font-semibold whitespace-nowrap">
              ₹ {Number(amount).toFixed(2)}
            </div>

            <div className="flex items-center gap-2 justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancelPayment}
              >
                Cancel Payment
              </Button>
              <Button
                onClick={() => setOpenTransactionModel(true)}
                className="bg-[#A1351B] text-white"
              >
                Ok done!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentDialog;
