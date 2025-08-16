/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  experimental: { typedRoutes: false },
  eslint: { ignoreDuringBuilds: true }
};
module.exports = nextConfig;
