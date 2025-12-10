/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'image.tmdb.org', 
      'img.youtube.com',
      'upload.wikimedia.org',      // Wikipedia images
      'flagcdn.com',              // Country flags
      'digitalhub.fifa.com',      // FIFA images
      'via.placeholder.com',      // Fallback images
      'ui-avatars.com'           // Avatar generation
    ],
  },
  // Enable ESLint during production build
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Optional: Add custom headers if needed
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;