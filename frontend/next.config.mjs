/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "4000",
                pathname: "/uploads/**",
            },
        ],
        domains: [
            "localhost:4000",
            "localhost",
            "placehold.co",
            "api.popeyes.vn",
            "qr.sepay.vn",
        ],
    },
    // reactStrictMode: false,
};

export default nextConfig;
