import type { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { ORDER_STATUSES } from "@/lib/admin/order-status";
import {
  addDays,
  startOfBangkokDay,
  startOfBangkokMonth,
} from "@/lib/admin/report-dates";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/** Orders counted as revenue / successful sales. */
const REVENUE_STATUSES: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "completed",
];

async function sumOrderTotal(where: {
  status?: OrderStatus | { in: OrderStatus[] };
  createdAt?: { gte?: Date; lt?: Date };
}) {
  const result = await db.order.aggregate({
    where,
    _sum: { totalSatang: true },
    _count: { _all: true },
  });
  return {
    count: result._count._all,
    totalSatang: result._sum.totalSatang ?? 0,
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todayStart = startOfBangkokDay();
    const tomorrowStart = addDays(todayStart, 1);
    const weekStart = addDays(todayStart, -6);
    const monthStart = startOfBangkokMonth();

    const [
      productTotal,
      productActive,
      productInactive,
      productNew,
      productRecommend,
      categoryTotal,
      categoryActive,
      orderTotal,
      revenueAll,
      revenueToday,
      revenueWeek,
      revenueMonth,
      statusGroups,
      categories,
      activeProductsByCategory,
      recentOrders,
      topItemsRaw,
    ] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.product.count({ where: { isActive: false } }),
      db.product.count({ where: { isNew: true } }),
      db.product.count({ where: { isRecommend: true } }),
      db.category.count(),
      db.category.count({ where: { isActive: true } }),
      db.order.count(),
      sumOrderTotal({ status: { in: REVENUE_STATUSES } }),
      sumOrderTotal({
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: todayStart, lt: tomorrowStart },
      }),
      sumOrderTotal({
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: weekStart, lt: tomorrowStart },
      }),
      sumOrderTotal({
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: monthStart, lt: tomorrowStart },
      }),
      db.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        _sum: { totalSatang: true },
      }),
      db.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
        select: {
          id: true,
          slug: true,
          label: true,
          isActive: true,
          _count: { select: { products: true } },
        },
      }),
      db.product.groupBy({
        by: ["categoryId"],
        where: { isActive: true },
        _count: { _all: true },
      }),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          orderNo: true,
          customerName: true,
          status: true,
          totalSatang: true,
          createdAt: true,
        },
      }),
      db.orderItem.groupBy({
        by: ["productId", "name"],
        where: {
          order: { status: { in: REVENUE_STATUSES } },
        },
        _sum: { quantity: true },
        _count: { _all: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10,
      }),
    ]);

    const statusMap = new Map(
      statusGroups.map((row) => [
        row.status,
        {
          status: row.status,
          count: row._count._all,
          totalSatang: row._sum.totalSatang ?? 0,
        },
      ]),
    );

    const ordersByStatus = ORDER_STATUSES.map((status) => {
      const row = statusMap.get(status);
      return {
        status,
        count: row?.count ?? 0,
        totalSatang: row?.totalSatang ?? 0,
      };
    });

    const activeCountByCategory = new Map(
      activeProductsByCategory.map((row) => [row.categoryId, row._count._all]),
    );

    const productsByCategory = categories.map((category) => {
      const activeCount = activeCountByCategory.get(category.id) ?? 0;
      return {
        id: category.id,
        slug: category.slug,
        label: category.label,
        isActive: category.isActive,
        productCount: category._count.products,
        activeProductCount: activeCount,
        inactiveProductCount: category._count.products - activeCount,
      };
    });

    const topProducts = topItemsRaw.map((row) => ({
      productId: row.productId,
      name: row.name,
      quantitySold: row._sum.quantity ?? 0,
      orderCount: row._count._all,
    }));

    const pendingActionCount =
      (statusMap.get("pending")?.count ?? 0) +
      (statusMap.get("paid")?.count ?? 0) +
      (statusMap.get("processing")?.count ?? 0);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      catalog: {
        productTotal,
        productActive,
        productInactive,
        productNew,
        productRecommend,
        categoryTotal,
        categoryActive,
        productsByCategory,
      },
      orders: {
        orderTotal,
        pendingActionCount,
        byStatus: ordersByStatus,
        revenue: {
          all: revenueAll,
          today: revenueToday,
          last7Days: revenueWeek,
          thisMonth: revenueMonth,
        },
        recent: recentOrders.map((order) => ({
          id: order.id,
          orderNo: order.orderNo,
          customerName: order.customerName,
          status: order.status,
          totalSatang: order.totalSatang,
          createdAt: order.createdAt.toISOString(),
        })),
        topProducts,
      },
    });
  } catch (error) {
    console.error("[admin/reports]", error);
    return NextResponse.json({ error: "โหลดรายงานไม่สำเร็จ" }, { status: 500 });
  }
}
