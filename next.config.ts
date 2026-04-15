import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/fpt/:path*",
                destination: "https://api.fpt.ai/:path*",
            },
        ];
    },
};

export default nextConfig;
