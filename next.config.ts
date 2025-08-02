import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only ignore errors in development, not production
  ...(process.env.NODE_ENV === 'development' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};

export default nextConfig;
