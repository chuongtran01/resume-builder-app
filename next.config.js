/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable server-side rendering for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Ensure Node.js APIs work in API routes
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Allow Node.js modules in server-side code
      config.externals = config.externals || [];
    }
    return config;
  },
};

module.exports = nextConfig;
