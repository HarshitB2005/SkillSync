import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove firebase-admin from this list so it bundles normally
  serverExternalPackages: ['pdf2json', 'mammoth'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;