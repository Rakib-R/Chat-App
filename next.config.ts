import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  experimental: {
    serverActions : {},
  },
      serverExternalPackages: 
      ['mongoose'],
   

   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      
      {
        protocol: 'https',
        hostname: '*.ufs.sh', // Use a wildcard for the subdomain
        port: '',
        pathname: '/f/**', // Optional: restrict the path if necessary
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
