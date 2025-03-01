/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.chess.com",
      },
    ],
  },
};

export default nextConfig;
