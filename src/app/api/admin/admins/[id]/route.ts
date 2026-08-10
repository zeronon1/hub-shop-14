import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
      displayName?: string | null;
      isActive?: boolean;
    };

    const admin = await db.admin.findUnique({ where: { id } });
    if (!admin) {
      return NextResponse.json({ error: "ไม่พบผู้ดูแลระบบ" }, { status: 404 });
    }

    if (id === session.id && body.isActive === false) {
      return NextResponse.json(
        { error: "ไม่สามารถปิดใช้งานบัญชีของตนเองได้" },
        { status: 400 },
      );
    }

    const username = body.username?.trim();
    if (username && username !== admin.username) {
      const duplicate = await db.admin.findUnique({ where: { username } });
      if (duplicate) {
        return NextResponse.json({ error: "ชื่อผู้ใช้นี้มีอยู่แล้ว" }, { status: 409 });
      }
    }

    if (body.password && body.password.length < 8) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
        { status: 400 },
      );
    }

    const updated = await db.admin.update({
      where: { id },
      data: {
        ...(username ? { username } : {}),
        ...(body.displayName !== undefined ? { displayName: body.displayName } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.password ? { passwordHash: await hashPassword(body.password) } : {}),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ admin: updated });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (id === session.id) {
    return NextResponse.json(
      { error: "ไม่สามารถลบบัญชีของตนเองได้" },
      { status: 400 },
    );
  }

  try {
    await db.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
