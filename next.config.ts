import type { NextConfig } from "next";



/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ TypeScript errors තිබුණත් build එක ඉස්සරහටම යවන්න කියලා Next.js එකට කියනවා
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
