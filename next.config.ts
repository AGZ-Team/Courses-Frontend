import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Keep unoptimized for external domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'educrat-react.vercel.app'
      },
      {
        protocol: 'https',
        hostname: 'api.cr-ai.cloud' // Django backend API (HTTPS)
      },
      {
        protocol: 'http',
        hostname: 'api.cr-ai.cloud' // Django backend API (HTTP)
      }
    ]
  }
};

// Specify the path to the request config file
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
