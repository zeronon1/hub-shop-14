"use client";

import type { ImageUploadSpec } from "@/lib/admin/image-upload-specs";
import { formatImageUploadSpec } from "@/lib/admin/image-upload-specs";
import {
  formatDimensions,
  getAspectRatioLabel,
  useImageDimensions,
} from "@/components/admin/useImageDimensions";

type ImageSizeHintProps = {
  spec: ImageUploadSpec;
  imageUrl?: string;
  className?: string;
};

export default function ImageSizeHint({ spec, imageUrl, className = "" }: ImageSizeHintProps) {
  const { dimensions, loading } = useImageDimensions(imageUrl);
  const currentSize = formatDimensions(dimensions);
  const currentRatio = dimensions ? getAspectRatioLabel(dimensions) : null;

  const recommended = formatImageUploadSpec(spec);
  const objectFitLabel = spec.objectFit === "contain" ? "พอดีกรอบ (contain)" : "เต็มกรอบ (cover)";

  return (
    <div className={`rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs text-blue-950 ${className}`}>
      <p className="font-semibold text-blue-900">ขนาดรูปที่แนะนำ — {spec.label}</p>
      <p className="mt-1">
        <span className="font-medium">แนะนำ:</span> {recommended} · {objectFitLabel}
      </p>
      {spec.notes ? <p className="mt-1 text-blue-800/80">{spec.notes}</p> : null}
      {imageUrl ? (
        <p className="mt-1.5 border-t border-blue-100 pt-1.5">
          <span className="font-medium">รูปปัจจุบัน:</span>{" "}
          {loading ? "กำลังอ่านขนาด..." : currentSize ?? "อ่านขนาดไม่ได้"}
          {currentRatio ? ` (${currentRatio})` : ""}
          {dimensions &&
          (dimensions.width !== spec.width || dimensions.height !== spec.height) ? (
            <span className="ml-1 text-amber-800">
              — ต่างจากที่แนะนำ {spec.width}×{spec.height}
            </span>
          ) : dimensions &&
            dimensions.width === spec.width &&
            dimensions.height === spec.height ? (
            <span className="ml-1 text-green-800">— ตรงขนาดแนะนำ</span>
          ) : null}
        </p>
      ) : (
        <p className="mt-1.5 text-blue-800/70">อัปโหลดรูปแล้วจะแสดงขนาดจริงของไฟล์ที่ใส่อยู่</p>
      )}
    </div>
  );
}
