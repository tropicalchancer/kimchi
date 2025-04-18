/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  // Disable automatic static optimization for pages that need to be dynamic
  experimental: {
    // Enable app directory
    appDir: true,
  },
  // Configure allowed image domains
  images: {
    domains: ['opiwlgojctrvwnuycerk.supabase.co'],
  },
}

module.exports = nextConfig 