"use client";

import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";

const mockProducts = [
    { id: "1", style_code: "RNK-001", name: "Classic Solitaire Ring", category: "Rings", quantity: 15, gold_weight: 4.5, net_gold: 4.0, status: 1 },
    { id: "2", style_code: "NCK-002", name: "Diamond Tennis Necklace", category: "Necklaces", quantity: 5, gold_weight: 15.2, net_gold: 14.8, status: 1 },
    { id: "3", style_code: "BRC-003", name: "Emerald Cut Bracelet", category: "Bracelets", quantity: 8, gold_weight: 12.0, net_gold: 11.5, status: 1 },
    { id: "4", style_code: "ERR-004", name: "Sapphire Drop Earrings", category: "Earrings", quantity: 20, gold_weight: 6.5, net_gold: 5.8, status: 0 },
    { id: "5", style_code: "RNK-005", name: "Vintage Halo Ring", category: "Rings", quantity: 3, gold_weight: 5.0, net_gold: 4.6, status: 1 },
];

export default function ProductsPage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Products Catalog</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Manage your jewelry inventory, variations, and stock levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800/50">
                        Export CSV
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
                        Add Product
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
                            placeholder="Search by name or style code..."
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
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Product Info</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Stock</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Net Gold</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockProducts.map((product) => (
                                <tr key={product.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
                                            <div className="flex flex-col">
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white">{product.name}</span>
                                                <span className="font-plus-jakarta text-xs font-medium text-gray-500 uppercase tracking-widest">{product.style_code}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-plus-jakarta text-sm font-semibold text-gray-600 dark:text-gray-300">{product.category}</td>
                                    <td className="px-6 py-5">
                                        <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{product.quantity}</span>
                                        <span className="ml-1 font-plus-jakarta text-[10px] font-medium text-gray-400">units</span>
                                    </td>
                                    <td className="px-6 py-5 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">{product.net_gold} gm</td>
                                    <td className="px-6 py-5">
                                        {product.status === 1 ? (
                                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Active</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">Draft</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 p-6 dark:border-gray-800/50">
                    <span className="font-plus-jakarta text-xs font-medium text-gray-500">Showing 1 to 5 of 45 products</span>
                    <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800">Prev</button>
                        <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800">1</button>
                        <button className="rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 transition-colors dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">2</button>
                        <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800">3</button>
                        <button className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
