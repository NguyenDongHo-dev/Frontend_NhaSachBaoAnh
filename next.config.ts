import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_SERVER: process.env.API_SERVER,
  },
  images: {
    domains: ["127.0.0.1", "localhost"],
  },
};

export default nextConfig;
