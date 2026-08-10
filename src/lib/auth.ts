import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const COOKIE_NAME = "admin_token";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

const BCRYPT_ROUNDS = 12;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export type SessionAdmin = {
  id: string;
  username: string;
  displayName: string | null;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(admin: { id: string; username: string }) {
  return new SignJWT({ username: admin.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const sub = payload.sub;
    const username = payload.username;
    if (!sub || typeof username !== "string") return null;
    return { id: sub, username };
  } catch {
    return null;
  }
}

export async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload !== null;
}

export async function getSession(): Promise<SessionAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const admin = await db.admin.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      isActive: true,
    },
  });

  if (!admin || !admin.isActive) return null;

  return {
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName,
  };
}

export async function authenticateAdmin(username: string, password: string) {
  const admin = await db.admin.findUnique({ where: { username } });
  if (!admin || !admin.isActive) return null;

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;

  return {
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName,
  } satisfies SessionAdmin;
}
