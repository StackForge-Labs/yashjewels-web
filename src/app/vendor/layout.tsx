"use client";

import { ReactNode, useState } from "react";
import VendorSidebar from "./_components/VendorSidebar";
import VendorHeader from "./_components/VendorHeader";
import { useVendorGuard } from "@/hooks/useAuthGuard";

export default function VendorLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isLoading, profile, isError } = useVendorGuard();

    if (isLoading || !profile || isError) return null;

    return (
        <div className="flex min-h-screen w-full bg-[#fafaf8] text-gray-900 antialiased selection:bg-amber-500/30 dark:bg-[#0a0a0a] dark:text-gray-100 transition-colors duration-300">
            <VendorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-1 flex-col transition-all duration-300 md:pl-[260px]">
                <VendorHeader
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    storeName={profile?.fullName ?? "Vendor"}
                />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/10 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
