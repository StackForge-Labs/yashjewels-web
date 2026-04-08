"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
    { name: "Rings", value: 400 },
    { name: "Necklaces", value: 300 },
    { name: "Bracelets", value: 300 },
    { name: "Earrings", value: 200 },
];

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4"];

export default function SalesByCategoryChart() {
    return (
        <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white/70 p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
            <div className="mb-6">
                <h3 className="font-plus-jakarta text-lg font-bold tracking-tight text-gray-900 dark:text-white">Sales Distribution</h3>
                <p className="font-plus-jakarta text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">By Category</p>
            </div>

            <div className="h-[320px] w-full items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", backgroundColor: 'rgba(255, 255, 255, 0.98)', color: '#000', fontFamily: 'var(--font-plus-jakarta)', fontSize: '12px' }}
                        />
                        <Legend 
                            iconType="circle" 
                            verticalAlign="bottom" 
                            formatter={(value) => <span className="font-plus-jakarta text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
