"use client";

import React, { FC, useCallback, useEffect, useState, useRef } from "react";
// UPLOADTHING
import "@uploadthing/react/styles.css";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import imageCompression from "browser-image-compression";


interface Props {
  onChange: (value: string) => void;
  initialImage?: string;
  setParentError: (message: string) => void;
}

export const Experimental_Profile_Pic: FC<Props> = ({
  onChange,
  initialImage,
  setParentError,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Guard against infinite upload loops
  const lastUploadedUrl = useRef<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("media", {
    onClientUploadComplete: (res) => {
      const uploadedUrl = res?.[0]?.ufsUrl;
      if (!uploadedUrl) return;

      lastUploadedUrl.current = uploadedUrl; // Remember this to prevent loops DURING ON CHANGE
      setPreviewUrl(uploadedUrl);
      onChange(uploadedUrl);
      setIsProcessing(false);
    },
    onUploadError: (error) => {
      setParentError(`Upload failed: ${error.message}`);
      setIsProcessing(false);
    },
  });

  // Integrated Compression + Auto-upload Logic
  useEffect(() => {
    const uploadInitialImage = async () => {
      //. Safety Guard: Don't upload if empty, if it's already a local blob, 
      // or if it's the URL we just finished uploading.
      if (!initialImage || initialImage.startsWith("blob:") || initialImage === lastUploadedUrl.current) {
          console.log('Either Image is Empty or Blob Object Or It\'s Initial Image')
        return;
      }

      try {
        setIsProcessing(true);
      
        // Fetch source
        const response = await fetch(initialImage);
        const blob = await response.blob();

        //  COMPRESSION logic integrated for initial images
       // CONVER IMAGE FROM BLOB TO URL 
      const fileName = initialImage.split("/").pop() || "INVALID IMAGE NAME";
      const file = new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
      });
        // Preview as blob
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload automatically
        await startUpload([file]);

        // 3. Automated Upload
        await startUpload([file]);
      } catch (error) {
        setParentError("Failed to process initial image");
        console.error(error);
        setIsProcessing(false);
      }
    };

    uploadInitialImage();
  }, [initialImage, startUpload]); // Keep dependencies minimal to prevent re-runs

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsProcessing(true);
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });

        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        const objectUrl = URL.createObjectURL(compressedFile);
        setPreviewUrl(objectUrl);

        await startUpload([compressedFile]);
      } catch (error) {
        setParentError("Could not process image. Please try another.");
        setIsProcessing(false);
      }
    },
    [previewUrl, startUpload, setParentError]
  );

  const revertToInitial = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropzone from opening
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(initialImage || null);
    if (initialImage) onChange(initialImage);
  };

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"], "image/webp": [".webp"] },
    multiple: false,
    disabled: isUploading || isProcessing,
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        {...getRootProps()}
        className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"}
        ${isFocused ? "ring-2 ring-blue-300" : ""}
        ${isUploading || isProcessing ? "opacity-50 cursor-wait" : ""}`}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar"
            fill
            sizes="96px"
            className="object-cover"
            priority={!previewUrl.startsWith("blob:")}
            unoptimized={previewUrl.startsWith("blob:")} // Fixes Next.js 404 on new blobs
          />
        ) : (
          <div className="text-gray-400 text-xs font-bold uppercase text-center p-2">
            Add Photo
          </div>
        )}

        {(isUploading || isProcessing) && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase tracking-tighter">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mb-1" />
            {isProcessing ? "Shrinking..." : "Uploading..."}
          </div>
        )}

        {previewUrl && previewUrl !== initialImage && !isUploading && !isProcessing && (
          <button
            type="button"
            onClick={revertToInitial}
            className="absolute bottom-1 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full hover:bg-red-500 transition-colors"
          >
            Revert
          </button>
        )}
      </div>
    </div>
  );
};

export default Experimental_Profile_Pic;