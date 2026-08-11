import { getOrderStatusLabel } from "@/lib/admin/order-status";
import { formatContactAddress } from "@/lib/admin/format-contact-address";
import { formatBaht, lineTotalBaht } from "@/lib/cart";
import type { Order } from "@/lib/orders";
import type { SiteContactInfo } from "@/lib/site-contact-types";

type OrderReceiptDocumentProps = {
  order: Order;
  contact: SiteContactInfo;
  shopName: string;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function OrderReceiptDocument({
  order,
  contact,
  shopName,
}: OrderReceiptDocumentProps) {
  const address = formatContactAddress(contact);
  const phones = contact.phones.join(", ");

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <header className="border-b border-gray-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          ใบเสร็จรับเงิน
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          {contact.companyName || shopName}
        </h2>
        {address ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{address}</p>
        ) : null}
        <div className="mt-2 space-y-0.5 text-sm text-gray-600">
          {phones ? <p>โทร: {phones}</p> : null}
          {contact.emails[0] ? <p>อีเมล: {contact.emails[0]}</p> : null}
        </div>
      </header>

      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-gray-500">เลขที่ออเดอร์</p>
          <p className="font-semibold text-gray-900">{order.orderNo}</p>
          <p className="mt-2 text-gray-500">วันที่สั่งซื้อ</p>
          <p className="text-gray-900">{formatDateTime(order.createdAt)}</p>
          {order.paidAt ? (
            <>
              <p className="mt-2 text-gray-500">วันที่ชำระเงิน</p>
              <p className="text-gray-900">{formatDateTime(order.paidAt)}</p>
            </>
          ) : null}
          <p className="mt-2 text-gray-500">สถานะ</p>
          <p className="text-gray-900">{getOrderStatusLabel(order.status)}</p>
        </div>
        <div>
          <p className="text-gray-500">ลูกค้า</p>
          <p className="font-semibold text-gray-900">{order.customerName}</p>
          <p className="mt-1 text-gray-900">{order.customerPhone}</p>
          {order.customerEmail ? (
            <p className="text-gray-900">{order.customerEmail}</p>
          ) : null}
          <p className="mt-2 whitespace-pre-wrap text-gray-900">{order.shippingAddress}</p>
        </div>
      </div>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-gray-200 bg-gray-50 text-left text-gray-600">
            <th className="px-2 py-2 font-medium">สินค้า</th>
            <th className="px-2 py-2 font-medium">ราคา</th>
            <th className="px-2 py-2 font-medium">จำนวน</th>
            <th className="px-2 py-2 text-right font-medium">รวม</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr
              key={item.id ?? `${item.productId}-${item.name}`}
              className="border-b border-gray-100"
            >
              <td className="px-2 py-2.5 text-gray-900">{item.name}</td>
              <td className="px-2 py-2.5">{formatBaht(item.priceBaht)}</td>
              <td className="px-2 py-2.5">{item.quantity}</td>
              <td className="px-2 py-2.5 text-right">
                {formatBaht(lineTotalBaht(item.priceBaht, item.quantity))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="px-2 py-3 text-right font-semibold">
              ยอดรวมทั้งสิ้น
            </td>
            <td className="px-2 py-3 text-right text-lg font-bold">
              {formatBaht(order.totalSatang / 100)}
            </td>
          </tr>
        </tfoot>
      </table>

      {order.note ? (
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-medium text-gray-800">หมายเหตุ:</span> {order.note}
        </p>
      ) : null}

      <p className="mt-8 text-center text-xs text-gray-500">
        ขอบคุณที่อุดหนุน {contact.companyName || shopName}
      </p>
    </article>
  );
}
