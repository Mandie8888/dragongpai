/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js to use the src directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Ensure API routes work
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
