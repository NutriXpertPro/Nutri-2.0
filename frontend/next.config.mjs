import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development", // Desabilitado em dev, habilitado em produção
    register: true,
    scope: "/",
    sw: "service-worker.js",
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
};

export default withPWA(nextConfig);
