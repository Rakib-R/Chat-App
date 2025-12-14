"use client"

import React, { useMemo,CSSProperties, useEffect, ReactElement, FC } from 'react'
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
  const [files, setFiles] = useState<File | null>();
     const onDrop = useCallback((acceptedFiles: File[]) => {
        
      const file = acceptedFiles[0];
      if (file) {
      setFiles(file);

        }
      }, []);
      
      
      const { startUpload, routeConfig, isUploading } = useUploadThing("media", {
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
  if (files) {

    const url = URL.createObjectURL(files);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  } 
}, [files]);

const handleUpload = async () => {
    if (files) {
      // startUpload expects an array of File objects
      await startUpload([files]);
      // Optional: Clear the preview after successful upload
      // setFileToUpload(null); 
    }
  };

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex', flexDirection: 'column',alignItems: 'center',padding: '10px',borderWidth: 2,
borderColor: 'grey',  borderStyle: 'dashed',outline: 'none',transition: 'border .24s ease-in-out',

};

const focusedStyle = {
  borderColor: 'blue',
  color: 'red',
  fontWeight: 'bold'
}; const acceptStyle = {
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
    accept: { 'image/*': [] }
  });


  const style: CSSProperties = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isFocused, isDragAccept, isDragReject]);


  return (
    <div>
        {/* ADDED UPLOADTHING EXPERIMENT */}

 <div {...getRootProps()}  className='h-32' >
      <input {...getInputProps()} />
  
  <div  >
{/*     
     {isDragAccept ?  ( <div className='w-16 h-16' >DRAGIIHNG  </div>) : ( null) }  
     {isFocused ? (<div className='w-16 h-16' style={{ border: '21px solid blue' }}>This is from FOCUSED </div> ) : (null)}
     */}

{files ? (
        <div className="w-32 h-32 rounded-full  text-center">
          {previewUrl && (
            <div className='relative flex rounded-full justify-center items-center w-full h-full'> 
              <img 
                  src={previewUrl} 
                  height={100}
                  width={100}
                  className="w-full h-full         
                    object-fit
                      rounded-full 
                      shadow-md"
              />
               </div>
      )}
        </div>
      ) : isDragActive ? (
        // Render this when the user is actively dragging a file
        <div className="text-center p-4">
          <p className="font-bold text-red-900">THIS IS NOT SHOWING</p>
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full text-center border-3 border-amber-300">
              <div className='relative flex rounded-full justify-center items-center hover:backdrop-blur-lg w-full h-full'> 
                <p className="absolute opacity-0 hover:opacity-100 font-bold text-red-900 ">Upload Your Photo</p>
                <img className='hover:backdrop-blur-lg object-fill' src="/user_place.jpg" alt="" height={100} width={100} />
                </div>
                
        </div> 
      )}
        </div>
      </div>
      {files && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`mt-4 px-4 py-2 font-bold rounded ${
            isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Click to Upload Photo'}
        </button>
      )}
    </div>

  )
}

export default Experimental