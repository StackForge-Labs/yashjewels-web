"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

export const PublicLayoutWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname() || "";
    // Hide public Header/Footer on admin routes
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="grow pb-0">{children}</main>
            <Footer />
        </>
    );
};
