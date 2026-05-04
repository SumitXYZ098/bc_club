import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dvvjkgh94f2v6.cloudfront.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ddfcdn.realtor.ca",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "my.matterport.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "nationwiderealty.ca",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "propimages.bcassessment.ca",
        pathname: "**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },

  reactStrictMode: false,
};

export default nextConfig;
