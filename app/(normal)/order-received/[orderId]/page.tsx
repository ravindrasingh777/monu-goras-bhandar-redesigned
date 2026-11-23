
import { notFound } from "next/navigation";
import { getOrderByOrderId } from "@/helper/order/action";
import OrderReceived from "@/components/OrderReceived";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderReceivedPage({
  params,
}: PageProps) {
  const { orderId } = await params;

  const response = await getOrderByOrderId(orderId);

  if (!response.success || !response.order) {
    notFound();
  }

  return <OrderReceived order={response.order} />;
}
