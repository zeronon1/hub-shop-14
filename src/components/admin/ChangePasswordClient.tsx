"use client";

import { useState } from "react";

export default function ChangePasswordClient() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      }

      setMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">เปลี่ยนรหัสผ่าน</h1>
      <p className="mb-6 text-sm text-gray-500">รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่านปัจจุบัน</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
            minLength={8}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
            minLength={8}
            required
          />
        </div>
        {message ? <p className="text-sm text-green-600">{message}</p> : null}
        {error ? <p className="text-sm text-red">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
        </button>
      </form>
    </div>
  );
}
