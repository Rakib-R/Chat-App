import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  experimental: {
    // serverActions : {
    //   allowedOrigins : ['https://musically-exergonic-hugo.ngrok-free.dev',
    //     'http://localhost:3000',           // ← ADD THIS
    //     'http://192.168.0.102:3000',       // ← ADD THIS
    //   ]
      
    // },
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
        hostname: "placehold.co",
      },
      {
      protocol: "https",
      hostname: "8r6eae37v6.ufs.sh",
    },
      {
        protocol: 'https',
        hostname: '**.ufs.sh', // Use a wildcard for the subdomain
        pathname: '/f/**', // Optional: restrict the path if necessary
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
