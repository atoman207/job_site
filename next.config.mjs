/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Free Japanese stock photos (Unsplash / Pexels) are allowed as remote sources.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'gclxshtnxanslibvyunk.supabase.co' },
    ],
  },
};

export default nextConfig;
