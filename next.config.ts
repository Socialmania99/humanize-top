import type { NextConfig } from "next";

const pages = process.env.STATIC_PAGES === "1";
const nextConfig: NextConfig = pages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: process.env.SITE_BASE_PATH ?? "",
    }
  : {};

export default nextConfig;
