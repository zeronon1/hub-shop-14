import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "gl.lnwfile.com" },
      { protocol: "https", hostname: "gg.lnwfile.com" },
      { protocol: "https", hostname: "aa.lnwfile.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "zerodesign.sgp1.digitaloceanspaces.com" },
      { protocol: "https", hostname: "sgp1.digitaloceanspaces.com" },
    ],
  },
};

export default nextConfig;
