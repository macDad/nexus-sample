/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "itisid-uploads-bkt-storage1.s3.ca-central-1.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
