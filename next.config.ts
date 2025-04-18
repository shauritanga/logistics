import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "plus.unsplash.com",
      "images.unsplash.com",
      "localhost",
      "res.cloudinary.com",
      "ferf1mheo22r9ira.public.blob.vercel-storage.com",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
};

export default nextConfig;
