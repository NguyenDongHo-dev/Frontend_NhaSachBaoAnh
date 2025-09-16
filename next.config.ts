import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_SERVER: process.env.API_SERVER,
  },
  images: {
    domains: ["localhost"],
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
