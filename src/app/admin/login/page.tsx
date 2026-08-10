"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("reason") === "session_expired") {
      void fetch("/api/auth/logout", { method: "POST" });
      setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
    }

    void fetch("/api/auth/me").then((res) => {
      if (res.ok) {
        window.location.href = "/admin/products";
      }
    });
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "เข้าสู่ระบบไม่สำเร็จ");
      }

      window.location.href = "/admin/products";
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
          ชื่อผู้ใช้
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          รหัสผ่าน
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-red py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-red">Admin Panel</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
          <p className="mt-2 text-sm text-gray-500">Momotaro Shop Management</p>
        </div>
        <Suspense fallback={<p className="text-sm text-gray-500">กำลังโหลด...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
