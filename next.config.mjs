/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',

  // Fix for isomorphic-dompurify and jsdom with Turbopack
  serverExternalPackages: ['jsdom'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
