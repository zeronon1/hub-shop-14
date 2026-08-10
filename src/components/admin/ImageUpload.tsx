"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ImageSizeHint from "@/components/admin/ImageSizeHint";
import type { ImageUploadSpec } from "@/lib/admin/image-upload-specs";
import { aspectRatioToCss } from "@/lib/admin/image-upload-specs";

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
  spec?: ImageUploadSpec;
  previewMaxWidth?: "sm" | "md" | "lg" | "full";
};

const previewMaxWidthClass = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-xl",
  full: "max-w-full",
} as const;

export default function ImageUpload({
  label,
  value,
  onChange,
  folder = "shop-13/uploads",
  hint,
  spec,
  previewMaxWidth = "sm",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const previewAspectRatio = spec ? aspectRatioToCss(spec.aspectRatio) : "16 / 9";
  const previewFitClass =
    spec?.objectFit === "contain" ? "object-contain p-2" : "object-cover object-center";
  const previewWidthClass = previewMaxWidthClass[previewMaxWidth];

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "อัปโหลดไม่สำเร็จ");
      }

      if (data.url) onChange(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {spec ? <ImageSizeHint spec={spec} imageUrl={value || undefined} /> : null}

      {value ? (
        <div
          className={`relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${previewWidthClass}`}
          style={{ aspectRatio: previewAspectRatio }}
        >
          <Image
            src={value}
            alt="Preview"
            fill
            className={previewFitClass}
            unoptimized={value.startsWith("http")}
          />
        </div>
      ) : (
        <div
          className={`flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 ${previewWidthClass}`}
          style={{ aspectRatio: previewAspectRatio, minHeight: "8rem" }}
        >
          ยังไม่มีรูปภาพ
          {spec ? (
            <span className="sr-only">
              อัตราส่วน {spec.aspectRatio}
            </span>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            ลบรูป
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
          event.target.value = "";
        }}
      />
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="หรือวาง URL รูปภาพ"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
      />
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red">{error}</p> : null}
    </div>
  );
}
