import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["cdn.sanity.io"], // Add your Sanity CDN domain
  },
};

export default nextConfig;
