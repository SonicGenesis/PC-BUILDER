import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/images',
      },
      {
        protocol: 'https',
        hostname: 'www.nvidia.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pcworld.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.amd.com',
        port: '',
        pathname: '/system/files/**',
      },
      {
        protocol: 'https',
        hostname: 'rukminim2.flixcart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cyberpowerpc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ms.codes',
        port: '',
        pathname: '/cdn/**',
      },
    ],
  },
};

export default nextConfig;
