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
    output: 'standalone',
    // Força o uso do Webpack em vez do Turbopack para resolver conflitos com PWA
    webpack: (config, { isServer }) => {
        return config;
    },
    typescript: {
        // Ignora erros do TypeScript durante o build
        ignoreBuildErrors: true,
    },
    eslint: {
        // Ignora erros do ESLint durante o build
        ignoreDuringBuilds: true,
    },
};

export default withPWA(nextConfig);
