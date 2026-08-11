import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.173.0.16", "192.168.0.198", "192.168.0.198"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
