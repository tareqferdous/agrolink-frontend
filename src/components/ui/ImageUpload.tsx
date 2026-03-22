"use client";

import { uploadToImageBB } from "@/lib/imagebb";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 3,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = maxImages - value.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, remaining);

    try {
      setUploading(true);
      const urls = await Promise.all(
        filesToUpload.map((file) => uploadToImageBB(file))
      );
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch {
      toast.error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">
        Images{" "}
        <span className="text-gray-400 font-normal">
          (max {maxImages})
        </span>
      </label>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100"
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {value.length < maxImages && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full py-8 border-2 border-dashed rounded-xl text-sm transition-colors flex flex-col items-center gap-2 ${
            uploading
              ? "border-green-300 bg-green-50 text-green-600 cursor-wait"
              : "border-gray-200 text-gray-400 hover:border-green-300 hover:bg-green-50 hover:text-green-600 cursor-pointer"
          }`}
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">📷</span>
              <span>
                Click to upload{" "}
                <span className="text-gray-300">
                  ({value.length}/{maxImages})
                </span>
              </span>
              <span className="text-xs text-gray-300">
                JPG, PNG, WEBP — max 32MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}