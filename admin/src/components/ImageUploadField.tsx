import { useRef } from "react";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  currentUrl?: string;
  pendingFile: File | null;
  onFileChange: (file: File | null) => void;
  onUrlClear: () => void;
  accept?: string;
  previewClass?: string;
  rounded?: boolean;
}

export default function ImageUploadField({
  label,
  currentUrl,
  pendingFile,
  onFileChange,
  onUrlClear,
  accept = "image/jpeg,image/png,image/webp",
  previewClass = "w-20 h-20 object-cover rounded-xl",
  rounded = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = pendingFile ? URL.createObjectURL(pendingFile) : currentUrl || "";

  return (
    <div>
      <label className="text-xs font-medium text-gray-700 block mb-2">{label}</label>
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative flex-shrink-0">
            <img
              src={preview}
              alt="preview"
              className={`${previewClass} ${rounded ? "!rounded-full" : ""}`}
            />
            <button
              type="button"
              onClick={() => { onFileChange(null); onUrlClear(); }}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow hover:bg-red-600 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition cursor-pointer ${rounded ? "rounded-full" : "rounded-xl"}`}
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Upload</span>
          </button>
        )}
        {preview && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-primary-600 hover:underline"
          >
            <Camera className="w-3.5 h-3.5" /> Change image
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileChange(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
