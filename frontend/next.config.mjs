// PWA disabled - causing issues
// import withPWAInit from "@ducanh2912/next-pwa";
// const withPWA = withPWAInit({...});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    poweredByHeader: false,
    reactStrictMode: true,
    outputFileTracingIncludes: {
        '/api/*': ['./public/*'],
    },
};

export default nextConfig;
