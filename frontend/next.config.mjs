// PWA disabled - causing issues
// import withPWAInit from "@ducanh2912/next-pwa";
// const withPWA = withPWAInit({...});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',  // Removido para habilitar middleware e SSR
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
