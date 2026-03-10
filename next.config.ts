import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d31u95r9ywbjex.cloudfront.net",
        pathname: "/sites/default/files/images/visualtests/**",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      "@mui/styled-engine": "@mui/styled-engine-sc",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mui/styled-engine": path.resolve(
        __dirname,
        "node_modules/@mui/styled-engine-sc"
      ),
    };
    return config;
  },
};

export default nextConfig;
