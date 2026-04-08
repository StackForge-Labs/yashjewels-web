"use client";

import { Search, Filter, Mail, ShieldAlert, ShieldCheck, Download, UserPlus } from "lucide-react";

const mockCustomers = [
    { id: "1", name: "Eleanor Vance", email: "eleanor.vance@example.com", phone: "+1 (555) 123-4567", status: 1, two_fa: true, joined: "2026-01-15", total_spent: "$14,500.00" },
    { id: "2", name: "James Sterling", email: "james.s@example.com", phone: "+44 20 7123 4567", status: 1, two_fa: false, joined: "2026-02-28", total_spent: "$32,300.00" },
    { id: "3", name: "Sophia Chen", email: "sophia.chen@example.com", phone: "+65 8123 4567", status: 1, two_fa: true, joined: "2026-03-10", total_spent: "$4,850.00" },
    { id: "4", name: "Michael Ross", email: "michael.r@example.com", phone: "+1 (555) 987-6543", status: 0, two_fa: false, joined: "2026-04-01", total_spent: "$0.00" },
];

export default function CustomersPage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Customer Directory</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Manage client profiles, KYC status, and purchase history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800/50">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700">
                        <UserPlus className="h-4 w-4" />
                        Add Client
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                {/* Search and Filters */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <div className="flex max-w-md flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:focus-within:border-blue-500">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800/50">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50 dark:text-gray-500">
                            <tr>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Client Profile</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Security</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Joined Date</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">LTV (Spent)</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockCustomers.map((customer) => (
                                <tr key={customer.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-plus-jakarta text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col relative w-full group-hover:pr-6 transition-all">
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white">
                                                    {customer.name}
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <span className="font-plus-jakarta text-xs font-medium text-gray-500">{customer.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            {customer.status === 1 ? (
                                                <span className="inline-flex items-center gap-1.5 w-max rounded-lg bg-emerald-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 w-max rounded-lg bg-gray-100 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span> Inactive
                                                </span>
                                            )}
                                            
                                            {customer.two_fa ? (
                                                <span className="inline-flex items-center gap-1 w-max font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> 2FA Enabled
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 w-max font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    <ShieldAlert className="h-3 w-3 text-amber-500" /> No 2FA
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {customer.joined}
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        {customer.total_spent}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400">
                                            Manage Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 p-6 dark:border-gray-800/50">
                    <span className="font-plus-jakarta text-xs font-medium text-gray-500">Showing 4 of 2,450 clients</span>
                    <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800">Prev</button>
                        <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-900 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-white">1</button>
                        <button className="rounded-lg border border-transparent px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">2</button>
                        <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
