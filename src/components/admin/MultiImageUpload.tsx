"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ImageSizeHint from "@/components/admin/ImageSizeHint";
import {
  formatDimensions,
  useImageDimensions,
} from "@/components/admin/useImageDimensions";
import type { ImageUploadSpec } from "@/lib/admin/image-upload-specs";
import { aspectRatioToCss } from "@/lib/admin/image-upload-specs";

type MultiImageUploadProps = {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  hint?: string;
  spec?: ImageUploadSpec;
};

function GalleryThumb({
  url,
  onRemove,
  aspectRatio,
}: {
  url: string;
  onRemove: () => void;
  aspectRatio: string;
}) {
  const { dimensions, loading } = useImageDimensions(url);
  const sizeLabel = loading ? "..." : formatDimensions(dimensions) ?? "?";

  return (
    <div className="space-y-1">
      <div
        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
        style={{ aspectRatio: aspectRatioToCss(aspectRatio) }}
      >
        <Image
          src={url}
          alt="Gallery preview"
          fill
          className="object-contain p-2"
          unoptimized={url.startsWith("http")}
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          ลบ
        </button>
      </div>
      <p className="truncate text-center text-[10px] text-gray-500">{sizeLabel}</p>
    </div>
  );
}

async function uploadFile(file: File, folder: string) {
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

  if (!data.url) {
    throw new Error("อัปโหลดไม่สำเร็จ");
  }

  return data.url;
}

export default function MultiImageUpload({
  label,
  values,
  onChange,
  folder = "shop-13/uploads",
  hint,
  spec,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [error, setError] = useState("");

  const previewAspect = spec?.aspectRatio ?? "1:1";
  const firstImage = values[0];

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploading(true);
    setError("");
    setUploadProgress(`0 / ${fileList.length}`);

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (let index = 0; index < fileList.length; index++) {
      setUploadProgress(`${index + 1} / ${fileList.length}`);
      try {
        const url = await uploadFile(fileList[index], folder);
        uploadedUrls.push(url);
      } catch (uploadError) {
        errors.push(
          uploadError instanceof Error
            ? `${fileList[index].name}: ${uploadError.message}`
            : `${fileList[index].name}: อัปโหลดไม่สำเร็จ`,
        );
      }
    }

    if (uploadedUrls.length > 0) {
      onChange(Array.from(new Set([...values, ...uploadedUrls])));
    }

    if (errors.length > 0) {
      setError(errors.join(" | "));
    }

    setUploading(false);
    setUploadProgress("");
  };

  const addManualUrl = () => {
    const url = manualUrl.trim();
    if (!url) return;
    onChange(Array.from(new Set([...values, url])));
    setManualUrl("");
  };

  const removeImage = (url: string) => {
    onChange(values.filter((item) => item !== url));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {spec ? <ImageSizeHint spec={spec} imageUrl={firstImage} /> : null}

      {values.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {values.map((url) => (
            <GalleryThumb
              key={url}
              url={url}
              aspectRatio={previewAspect}
              onRemove={() => removeImage(url)}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 text-center text-sm text-gray-400"
          style={{ aspectRatio: aspectRatioToCss(previewAspect), maxHeight: "12rem" }}
        >
          ยังไม่มีรูปใน Gallery
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {uploading
            ? `กำลังอัปโหลด... ${uploadProgress}`
            : "อัปโหลดหลายรูป"}
        </button>
        {values.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            disabled={uploading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            ลบทั้งหมด
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            void handleUploadFiles(files);
          }
          event.target.value = "";
        }}
      />

      <div className="flex gap-2">
        <input
          type="url"
          value={manualUrl}
          onChange={(event) => setManualUrl(event.target.value)}
          placeholder="หรือวาง URL รูปภาพ"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
        />
        <button
          type="button"
          onClick={addManualUrl}
          disabled={uploading || !manualUrl.trim()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
        >
          เพิ่ม URL
        </button>
      </div>

      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red">{error}</p> : null}
    </div>
  );
}
