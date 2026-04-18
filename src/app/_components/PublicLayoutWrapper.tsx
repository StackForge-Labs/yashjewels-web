"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { SignalRWatcher } from "./SignalRWatcher";

export const PublicLayoutWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname() || "";
    // Hide public Header/Footer on admin, vendor, and shipper routes
    const isPortalRoute = pathname.startsWith("/admin") || pathname.startsWith("/vendor") || pathname.startsWith("/shipper");

    if (isPortalRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <SignalRWatcher />
            <Header />
            <main className="grow pb-0">{children}</main>
            <Footer />
        </>
    );
};
