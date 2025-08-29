/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings for browser extensions
  reactStrictMode: true,
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Suppress specific hydration warnings
  experimental: {
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
