import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // If your repository name is not the root, uncomment and set the basePath
  basePath: process.env.NODE_ENV === "production" ? "/solo_clover" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/solo_clover" : "",
};

export default nextConfig;
