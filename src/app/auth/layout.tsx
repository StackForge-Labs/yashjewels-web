import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Yash Jewels - The Maison of Brilliance",
    description: "Access your Yash Jewels account to manage your diamond collection and bespoke orders.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full">
            {children}
        </div>
    );
}
