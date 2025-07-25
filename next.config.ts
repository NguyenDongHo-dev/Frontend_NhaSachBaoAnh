import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 env: {
    API_SERVER: process.env.API_SERVER,
  },
};

export default nextConfig;
