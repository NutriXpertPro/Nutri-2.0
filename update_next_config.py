import withPWAInit from "@ducahn2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    scope: "/",
    sw: "service-worker.js",
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
};

export default withPWA(nextConfig);
