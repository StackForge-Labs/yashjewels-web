"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 2000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
    { name: "Aug", revenue: 3100 },
    { name: "Sep", revenue: 4200 },
    { name: "Oct", revenue: 5300 },
    { name: "Nov", revenue: 4800 },
    { name: "Dec", revenue: 6000 },
];

export default function RevenueChart() {
    return (
        <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white/70 p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
            <div className="mb-6">
                <h3 className="font-plus-jakarta text-lg font-bold tracking-tight text-gray-900 dark:text-white">Revenue Analytics</h3>
                <p className="font-plus-jakarta text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">Monthly store revenue for 2026</p>
            </div>
            
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500, fontFamily: 'var(--font-plus-jakarta)' }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500, fontFamily: 'var(--font-plus-jakarta)' }} 
                            dx={-10}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", backgroundColor: 'rgba(255, 255, 255, 0.98)', color: '#000', fontFamily: 'var(--font-plus-jakarta)', fontSize: '12px' }}
                            itemStyle={{ color: '#2563EB', fontWeight: 600 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
