import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for large mobile photos
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
