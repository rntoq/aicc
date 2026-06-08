import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d31u95r9ywbjex.cloudfront.net",
        pathname: "/sites/default/files/images/visualtests/**",
      },
      {
        protocol: "https",
        hostname: "app.joo.kz",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "optim.tildacdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "voshod.mai.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
