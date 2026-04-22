"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import { useAdminGuard } from "@/hooks/useAuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    // Block render until profile is confirmed as admin/vendor
    const { isLoading, profile, isError } = useAdminGuard();

    // Show nothing while loading, when profile isn't ready, or during error redirect
    if (isLoading || !profile || isError) return null;

    return (
        <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-900 antialiased selection:bg-blue-500/30 dark:bg-[#0a0a0a] dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar with state control */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isCollapsed={isCollapsed} />
            
            <div className={`flex flex-1 flex-col transition-all duration-300 ${isCollapsed ? "md:pl-[80px]" : "md:pl-[280px]"}`}>
                <AdminHeader 
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isCollapsed={isCollapsed}
                />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/10 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
