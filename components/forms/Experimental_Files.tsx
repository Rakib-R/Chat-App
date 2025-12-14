"use client"

import React, { useMemo,CSSProperties, useEffect, ReactElement, FC } from 'react'
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState, useCallback } from 'react';

// DROP ZONE
// import { UploadDropzone } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/lib/uploadthing";

import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";


type props = {
  
}
    
export const Experimental: FC<props>= ({}) : ReactElement => {

   const [fileToUpload, setFileToUpload] = useState<File | null>(null); 
     
     const onDrop = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
  
      setFileToUpload(file)
        }
      }, []);
      
      
      const { startUpload, routeConfig } = useUploadThing("media", {
        onClientUploadComplete: () => {
          alert("uploaded successfully!");
        },
        onUploadError: () => {
          alert("error occurred while uploading");
        },
        onUploadBegin: (file) => {
          console.log("upload has begun for", file);
        },
      });
    
        const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
          generatePermittedFileTypes(routeConfig).fileTypes,
        ),

      });

const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
  if (fileToUpload) {

    const url = URL.createObjectURL(fileToUpload); // Create a temporary URL
    setPreviewUrl(url);

    // Clean up the object URL when the component unmounts or files changes
    return () => URL.revokeObjectURL(url);
  } 
}, [fileToUpload]);




const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex', flexDirection: 'column',alignItems: 'center',padding: '10px',borderWidth: 2,
  borderRadius: 2,borderColor: 'grey',  borderStyle: 'dashed',outline: 'none',transition: 'border .24s ease-in-out',

};

const focusedStyle = {
  borderColor: 'blue',
  color: 'red',
  fontWeight: 'bold'
};

const acceptStyle = {
  borderColor: 'red'
};

const rejectStyle = {
  borderColor: 'red'
};

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDrop,
    accept: { 'image/*': [] } // Example constraint
  });


  const style: CSSProperties = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isFocused, isDragAccept, isDragReject]);

console.log("PreviewURL" ,previewUrl)

  return (
    <div>Experimental
        {/* ADDED UPLOADTHING EXPERIMENT */}

 <div {...getRootProps()} style={style} className='h-32' >
      <input {...getInputProps()} />
  
  <div style={isFocused ? {backgroundColor: 'red', color : 'red' , padding : '39px', margin:'55px'} : {color : ''}} >
     {isDragAccept ?  ( <div className='w-16 h-16' >DRAGIIHNG  </div>) : ( null) }  
     {isFocused ? (<div className='w-16 h-16' style={{ border: '21px solid blue' }}>This is from FOCUSED </div> ) : (null)}
    

{fileToUpload ? (
        <div className="text-center p-4">
          <p className="font-bold text-red-900">Ready to Upload:</p>
          <p className="text-sm italic text-red-900">{fileToUpload.name}</p>
        </div>
      ) : isDragActive ? (
        // Render this when the user is actively dragging a file
        <div className="text-center p-4">
            <p>Drop the file here!</p>
        </div>
      ) : (
        // Render the default instruction
        <div className="text-center p-4">
            <p>🖼️ Drag and drop your file, or click to select.</p>
        </div>
      )}

      {/* RENDER THE IMAGE PREVIEW HERE */}
      {previewUrl && (
          <div className="mt-4 flex justify-center ">
              <img 
                  src={previewUrl} 
                  alt='IMAGE'
                  className="max-h-64 object-contain rounded-lg shadow-md"
              />
          </div>
      )}
        </div>
      </div>

      
    </div>

  )
}

export default Experimental