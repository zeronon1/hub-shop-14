import { formatContactAddress } from "@/lib/admin/format-contact-address";
import type { Order } from "@/lib/orders";
import type { SiteContactInfo } from "@/lib/site-contact-types";

type OrderPackingSlipDocumentProps = {
  order: Order;
  contact: SiteContactInfo;
  shopName: string;
};

export default function OrderPackingSlipDocument({
  order,
  contact,
  shopName,
}: OrderPackingSlipDocumentProps) {
  const senderAddress = formatContactAddress(contact);
  const senderPhones = contact.phones.join(", ");
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <header className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            ใบปะหน้าพัสดุ
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            {contact.companyName || shopName}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">เลขออเดอร์</p>
          <p className="font-mono text-lg font-bold tracking-wide text-gray-900">
            {order.orderNo}
          </p>
          {order.trackingNumber ? (
            <>
              <p className="mt-2 text-xs text-gray-500">เลขพัสดุ</p>
              <p className="font-mono text-base font-semibold text-gray-900">
                {order.trackingNumber}
              </p>
            </>
          ) : null}
        </div>
      </header>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-lg border border-gray-200 p-4 print:border-gray-400">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            ผู้ส่ง
          </p>
          <p className="mt-2 text-base font-semibold text-gray-900">
            {contact.companyName || shopName}
          </p>
          {senderAddress ? (
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{senderAddress}</p>
          ) : null}
          {senderPhones ? (
            <p className="mt-2 text-sm text-gray-700">โทร: {senderPhones}</p>
          ) : null}
        </section>

        <section className="rounded-lg border-2 border-gray-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            ผู้รับ
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{order.customerName}</p>
          <p className="mt-1 text-lg font-medium text-gray-900">{order.customerPhone}</p>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-gray-900">
            {order.shippingAddress}
          </p>
        </section>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-gray-300 px-4 py-5 text-center">
        <p className="text-xs text-gray-500">อ้างอิงออเดอร์</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-[0.2em] text-gray-900">
          {order.orderNo}
        </p>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900">
          รายการสินค้า ({itemCount} ชิ้น)
        </h3>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-gray-200 text-left text-gray-600">
              <th className="px-2 py-2 font-medium">สินค้า</th>
              <th className="px-2 py-2 text-right font-medium">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={item.id ?? `${item.productId}-${item.name}`}
                className="border-b border-gray-100"
              >
                <td className="px-2 py-2 text-gray-900">{item.name}</td>
                <td className="px-2 py-2 text-right font-medium">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {order.note ? (
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-medium text-gray-800">หมายเหตุลูกค้า:</span> {order.note}
        </p>
      ) : null}
    </article>
  );
}
