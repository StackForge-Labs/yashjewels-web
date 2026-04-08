"use client";

import { ReactNode } from "react";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0a0a0a]">
            {/* Sidebar is fixed on the left */}
            <AdminSidebar />
            
            <div className="flex flex-1 flex-col md:pl-64">
                <AdminHeader />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
