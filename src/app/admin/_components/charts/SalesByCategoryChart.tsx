"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
    { name: "Rings", value: 400 },
    { name: "Necklaces", value: 300 },
    { name: "Bracelets", value: 300 },
    { name: "Earrings", value: 200 },
];

const COLORS = ["#eab308", "#10b981", "#3b82f6", "#8b5cf6"];

export default function SalesByCategoryChart() {
    return (
        <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#222] dark:bg-[#111]">
            <div className="mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Sales by Category</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Distribution across collections</p>
            </div>

            <div className="h-[300px] w-full items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#000' }}
                        />
                        <Legend iconType="circle" verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
