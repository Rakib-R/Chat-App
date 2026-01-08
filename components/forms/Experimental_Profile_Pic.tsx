"use client";

import React, { useMemo, useState, useCallback, useEffect, FC } from 'react';
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/lib/uploadthing";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import Image from 'next/image';

interface props {
 setFiles: (files: File[]) => void;
  onChange : (value : string)  => void;
  initialImage : string;

}

export const Experimental_Profile_Pic: FC<props> = ({ setFiles, onChange, initialImage }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. UPLOADTHING HOOK
  const { startUpload, routeConfig, isUploading } = useUploadThing("media", {
    onClientUploadComplete: (res) => {
      const uploadedUrl = res?.[0]?.ufsUrl;
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
        setFile(null); // Clear selected file after success
        alert("Upload Complete!");
      }
    },
    onUploadError: (error) => {
      alert(`Upload failed: ${error.message}`);
    },
  });

  // 2. DROPZONE HANDLER
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create local preview

      // HAS-IMAGE CHANGED FUNCTION FROM ACCOUNT PROFILE
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreviewUrl(base64); // Local preview
        onChange(base64);      // Tell React Hook Form the value changed
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: routeConfig 
      ? generateClientDropzoneAccept(generatePermittedFileTypes(routeConfig).fileTypes)
      : undefined,
    multiple: false,
  });

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  // 3. STYLING LOGIC
  const containerStyle = useMemo(() => {
    return `
      relative w-24 h-24 rounded-full border-2 transition-all duration-200 cursor-pointer
      flex items-center justify-center overflow-hidden group
      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 hover:border-blue-400'}
      ${isFocused ? 'ring-2 ring-blue-200 border-blue-500' : ''}
    `;
  }, [isDragActive, isFocused]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Dropzone Container */}
      <div {...getRootProps()} className={containerStyle}>
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={previewUrl}
              alt="Preview"
              width={50}
              height={50}
              className="w-full h-full object-cover p-4"
              priority
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">Change Photo</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
             {/* Default Avatar State */}
             <div className="text-2xl mb-1">＋</div>
             <p className="text-[10px] uppercase font-bold">Photo</p>
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {isDragActive && (
        <p className="text-blue-500 text-sm animate-pulse">Drop to update photo</p>
      )}
    </div>
  );
};

export default Experimental_Profile_Pic;