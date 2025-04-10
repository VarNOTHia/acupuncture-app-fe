import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true, // 跳过 ESLint
  },
};

export default nextConfig;
