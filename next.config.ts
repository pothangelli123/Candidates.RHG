/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during the build - this doesn't affect development mode
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Add optimizations for development
  reactStrictMode: false, // Consider setting to false in development
  modularizeImports: {
    // Optimize imports for @react-pdf and framer-motion
    '@react-pdf/renderer': {
      transform: '@react-pdf/renderer/{{member}}',
    },
    'framer-motion': {
      transform: 'framer-motion/{{member}}',
    },
  },
};

export default nextConfig;
