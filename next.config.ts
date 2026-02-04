import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages project sites are served at /repo-name - BASE_PATH is set in CI
  basePath: process.env.BASE_PATH ?? "",
  assetPrefix: process.env.BASE_PATH ?? "",
  trailingSlash: true, // Helps GitHub Pages resolve routes correctly
};

export default nextConfig;
