/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Make the root domain available to middleware at runtime
  env: {
    ROOT_DOMAIN: process.env.ROOT_DOMAIN || "paolo.org.uk",
  },
};

export default nextConfig;
