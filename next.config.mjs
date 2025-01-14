/** @type {import('next').NextConfig} */
import withTM from "next-transpile-modules";

const WithTM = withTM([
  "@honeycomb-protocol/profile-hooks", // Add the problematic package here
]);

const nextConfig = WithTM({
  reactStrictMode: false,
  images: {
    domains: ["arweave.net", "gateway.irys.xyz", "devnet.irys.xyz"],
  },
  webpack: (config) => {
    config.resolve.extensions.push(".jsx"); // Add support for .jsx files
    return config;
  },
});

export default nextConfig;
