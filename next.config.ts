import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: !isDevelopment,
  images: {
    unoptimized: isDevelopment,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 800,
        ignored: [
          "**/.git/**",
          "**/.next/**",
          "**/node_modules/**",
          "**/marriage-db.xlsx",
          "**/*.csv",
        ],
        poll: 1000,
      };
    }

    return config;
  },
};

export default nextConfig;
