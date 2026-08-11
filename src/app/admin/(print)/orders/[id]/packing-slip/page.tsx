import { notFound } from "next/navigation";
import OrderPackingSlipDocument from "@/components/admin/OrderPackingSlipDocument";
import OrderPrintShell from "@/components/admin/OrderPrintShell";
import { getOrderById } from "@/lib/orders";
import { getSiteContactInfo } from "@/lib/site-contact";
import { siteInfo } from "@/lib/site-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderPackingSlipPage({ params }: PageProps) {
  const { id } = await params;
  const [order, contact] = await Promise.all([
    getOrderById(id),
    getSiteContactInfo(),
  ]);

  if (!order) notFound();

  return (
    <OrderPrintShell
      title={`ใบปะหน้า ${order.orderNo}`}
      backHref={`/admin/orders/${order.id}`}
    >
      <OrderPackingSlipDocument
        order={order}
        contact={contact}
        shopName={siteInfo.name}
      />
    </OrderPrintShell>
  );
}
