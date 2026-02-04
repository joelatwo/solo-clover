import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages project sites are served at /repo-name - BASE_PATH set in CI, fallback for joelatwo.github.io/solo_clover
  basePath:
    process.env.BASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/solo_clover" : ""),
  assetPrefix:
    process.env.BASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/solo_clover" : ""),
  trailingSlash: true, // Helps GitHub Pages resolve routes correctly
};

export default nextConfig;
