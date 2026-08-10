"use client";

import { useEffect, useState } from "react";

type AdminRecord = {
  id: string;
  username: string;
  displayName: string | null;
  isActive: boolean;
  createdAt: string;
};

type FormMode = "create" | "edit" | null;

const emptyForm = {
  username: "",
  password: "",
  displayName: "",
  isActive: true,
};

export default function AdminsClient() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [mode, setMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAdmins = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/admins");
    const data = (await response.json()) as {
      admins?: AdminRecord[];
      currentAdminId?: string;
      error?: string;
    };
    if (response.ok) {
      setAdmins(data.admins ?? []);
      setCurrentAdminId(data.currentAdminId ?? "");
    } else {
      setError(data.error ?? "โหลดข้อมูลไม่สำเร็จ");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadAdmins();
  }, []);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  };

  const openEdit = (admin: AdminRecord) => {
    setMode("edit");
    setEditingId(admin.id);
    setForm({
      username: admin.username,
      password: "",
      displayName: admin.displayName ?? "",
      isActive: admin.isActive,
    });
    setError("");
    setMessage("");
  };

  const closeForm = () => {
    setMode(null);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const isCreate = mode === "create";
      const response = await fetch(
        isCreate ? "/api/admin/admins" : `/api/admin/admins/${editingId}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            ...(form.password ? { password: form.password } : {}),
            displayName: form.displayName || null,
            isActive: form.isActive,
          }),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }

      setMessage(isCreate ? "เพิ่ม Admin เรียบร้อยแล้ว" : "อัปเดต Admin เรียบร้อยแล้ว");
      closeForm();
      await loadAdmins();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบ Admin นี้?")) return;

    const response = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "ลบไม่สำเร็จ");
      return;
    }

    setMessage("ลบ Admin เรียบร้อยแล้ว");
    await loadAdmins();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการ Admin</h1>
          <p className="mt-1 text-sm text-gray-500">เพิ่ม แก้ไข และจัดการบัญชีผู้ดูแลระบบ</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          + เพิ่ม Admin
        </button>
      </div>

      {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      {mode ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "เพิ่ม Admin ใหม่" : "แก้ไข Admin"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">ชื่อผู้ใช้</label>
              <input
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                รหัสผ่าน {mode === "edit" ? "(เว้นว่างถ้าไม่เปลี่ยน)" : ""}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
                required={mode === "create"}
                minLength={mode === "create" ? 8 : undefined}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">ชื่อที่แสดง</label>
              <input
                value={form.displayName}
                onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                />
                เปิดใช้งาน
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อผู้ใช้</th>
              <th className="px-4 py-3 font-medium">ชื่อที่แสดง</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  กำลังโหลด...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  ยังไม่มี Admin
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">
                    {admin.username}
                    {admin.id === currentAdminId ? (
                      <span className="ml-2 rounded bg-red-light px-2 py-0.5 text-xs text-red">
                        คุณ
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{admin.displayName ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        admin.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {admin.isActive ? "ใช้งาน" : "ปิด"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(admin)}
                        className="text-red hover:underline"
                      >
                        แก้ไข
                      </button>
                      {admin.id !== currentAdminId ? (
                        <button
                          type="button"
                          onClick={() => void handleDelete(admin.id)}
                          className="text-gray-500 hover:text-red"
                        >
                          ลบ
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
