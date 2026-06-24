import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(import.meta.dirname, '../'),
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
