import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";

// DO NOT import 'ourFileRouter' directly from the server file here

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// This hook is what you use in your Profile Pic component
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();