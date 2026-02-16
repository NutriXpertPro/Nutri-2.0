// PWA disabled - causing issues
// import withPWAInit from "@ducanh2912/next-pwa";
// const withPWA = withPWAInit({...});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
