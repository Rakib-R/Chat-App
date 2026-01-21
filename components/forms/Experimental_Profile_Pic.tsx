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
 setFile: React.Dispatch<React.SetStateAction<File[]>>;
  onChange : (value : File)  => void;
  initialImage : string;
  setParentError: (message: string) => void;

}

export const Experimental_Profile_Pic: FC<props> = ({ setFile, onChange , setParentError}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  // 1. UPLOADTHING HOOK
  const { startUpload, routeConfig, isUploading } = useUploadThing("media", {
    onClientUploadComplete: (res) => {
      const uploadedUrl = res?.[0]?.ufsUrl;
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
        setFile([]); // Clear selected file after success
        alert("Upload Complete!");
      }
    },
    onUploadError: (error) => {
      setParentError(`Upload failed: ${error.message}`);
    },
  });

  // 2. DROPZONE HANDLER
const onDrop = useCallback((acceptedFiles: File[]) => {
  const selectedFile = acceptedFiles[0];
  
  if (selectedFile.size > MAX_FILE_SIZE) {
    setParentError("This image is too heavy (Max 2MB). Please choose a smaller file.");
      return; // Stop the function here
    }

  else {
    // 1. Update the Form State IMMEDIATELY (True "Change" event)
    // We pass the File object, not a string.
    onChange(selectedFile); 

    // 2. Update local state for the UI
    setFile(acceptedFiles);

    // 3. Create a preview URL (Using Blob for better performance)
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  }
}, [onChange]);


  const { getRootProps, getInputProps, isDragActive, isFocused ,} = useDropzone({
    onDrop,
    accept: routeConfig 
      ? generateClientDropzoneAccept(generatePermittedFileTypes(routeConfig).fileTypes)
      : undefined,
    multiple: false,
    maxSize: 2000000,
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
          <div className="relative w-full h-full rounded-2xl">
            <Image
              src={previewUrl}
              alt="Preview"
              width={50}
              height={50}
              className="w-full h-full object-cover"
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