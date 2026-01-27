/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {

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
      protocol: 'https',
      hostname: '*.ufs.sh', // Use a wildcard for the subdomain
      pathname: '/f/**', // Optional: restrict the path if necessary
    },

    // NEEDED TO PREVENT UPLOADTHING RACE CONDITION
    {
        protocol: "https",
        hostname: "8r6eae37v6.ufs.sh", // Your specific sub-domain
      },
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
      hostname: "randomuser.me",
      pathname: '**',
    },
    
    ],
  },

};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
 
export default withBundleAnalyzer(nextConfig);

