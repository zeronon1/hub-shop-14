import { notFound } from "next/navigation";
import OrderPrintShell from "@/components/admin/OrderPrintShell";
import OrderReceiptDocument from "@/components/admin/OrderReceiptDocument";
import { getOrderById } from "@/lib/orders";
import { getSiteContactInfo } from "@/lib/site-contact";
import { siteInfo } from "@/lib/site-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderReceiptPage({ params }: PageProps) {
  const { id } = await params;
  const [order, contact] = await Promise.all([
    getOrderById(id),
    getSiteContactInfo(),
  ]);

  if (!order) notFound();

  return (
    <OrderPrintShell title={`ใบเสร็จ ${order.orderNo}`} backHref={`/admin/orders/${order.id}`}>
      <OrderReceiptDocument
        order={order}
        contact={contact}
        shopName={siteInfo.name}
      />
    </OrderPrintShell>
  );
}
