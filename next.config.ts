import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add firebase-admin here so Vercel doesn't break it during the build
  serverExternalPackages: ['pdf2json', 'mammoth', 'firebase-admin'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;