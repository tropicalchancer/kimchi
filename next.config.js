/** @type {import('next').NextConfig} */
const nextConfig = {
  // Runtime-only features (works in 13 → 14 without the deprecated flag)
  reactStrictMode: true,

  // App Router is on by default as of Next 14 – no need for experimental.appDir
  images: {
    domains: ['opiwlgojctrvwnuycerk.supabase.co'],
  },
};

module.exports = nextConfig;