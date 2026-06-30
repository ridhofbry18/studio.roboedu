"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud } from 'lucide-react';

export function UploadWidget({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  return (
    <CldUploadWidget 
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result) => {
        if (result.event === 'success') {
          const info = result.info as any;
          onUploadSuccess(info.secure_url);
        }
      }}
    >
      {({ open }) => {
        return (
          <button 
            type="button" 
            onClick={() => open()}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-variant border border-border rounded-xl text-sm font-bold hover:bg-surface transition-colors w-full justify-center"
          >
            <UploadCloud size={18} className="text-primary" />
            Upload File (Cloudinary)
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
