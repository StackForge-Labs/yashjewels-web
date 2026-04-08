"use client";

import { Search, Plus, Filter, Edit3, Trash2 } from "lucide-react";

const mockCategories = [
    { id: "1", name: "Rings", slug: "rings", parent: "-", sort_order: 1, active: true },
    { id: "2", name: "Engagement Rings", slug: "engagement-rings", parent: "Rings", sort_order: 2, active: true },
    { id: "3", name: "Necklaces", slug: "necklaces", parent: "-", sort_order: 3, active: true },
    { id: "4", name: "Pendants", slug: "pendants", parent: "Necklaces", sort_order: 4, active: true },
    { id: "5", name: "Custom Collections", slug: "custom", parent: "-", sort_order: 5, active: false },
];

export default function CategoriesPage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Product Categories</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Organize your store taxonomy and navigation loops.</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    New Category
                </button>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                {/* Search */}
                <div className="flex border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="flex max-w-sm flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:focus-within:border-blue-500">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find category..."
                            className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50 dark:text-gray-500">
                            <tr>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Name</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Slug</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Parent</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Sort</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockCategories.map((cat) => (
                                <tr key={cat.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        {cat.name}
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">
                                        /{cat.slug}
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">
                                        {cat.parent}
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        {cat.sort_order}
                                    </td>
                                    <td className="px-8 py-5">
                                        {cat.active ? (
                                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Active</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800 dark:hover:text-rose-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
