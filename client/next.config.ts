/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Enables app/ directory routing
  },
};

export default nextConfig;
export {}; // 👈 Add this line to fix the error
