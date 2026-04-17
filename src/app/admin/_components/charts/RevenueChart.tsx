import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Calendar } from "lucide-react";
import { getDashboardChartsApi } from "@/services/admin.service";

export default function RevenueChart({ range: parentRange }: { range: string }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const days = parentRange === "today" ? 1 : parentRange === "week" ? 7 : parentRange === "month" ? 30 : 365;

    useEffect(() => {
        const loadCharts = async () => {
            setLoading(true);
            try {
                const res = await getDashboardChartsApi(days);
                if (res.success) {
                    const chartNodes = res.data.revenueHistory.map((node: any) => ({
                        name: node.date,
                        revenue: node.revenue
                    }));
                    setData(chartNodes);
                }
            } catch (error) {
                console.error("Failed to load revenue charts", error);
            } finally {
                setLoading(false);
            }
        };
        loadCharts();
    }, [days]);

    const gradientColors = ["#3b82f6", "#60a5fa"];

    return (
        <div id="tour-revenue-chart" className="flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-white/70 p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="font-plus-jakarta text-xl font-bold tracking-tight text-gray-900 dark:text-white">Revenue Analytics</h3>
                    <p className="mt-1 font-plus-jakarta text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        {parentRange} performance
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-1.5 dark:bg-[#1a1a1a]">
                    <div className="flex items-center px-4 py-1.5 font-plus-jakarta text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Calendar className="mr-2 h-4 w-4" /> Live Sync
                    </div>
                </div>
            </div>
            
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={gradientColors[0]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.4} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600, fontFamily: 'var(--font-plus-jakarta)' }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600, fontFamily: 'var(--font-plus-jakarta)' }} 
                            dx={-10}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", backgroundColor: 'rgba(255, 255, 255, 0.98)', padding: '12px 16px', color: '#000', fontFamily: 'var(--font-plus-jakarta)', fontSize: '13px' }}
                            itemStyle={{ color: gradientColors[0], fontWeight: 700 }}
                            cursor={{ stroke: gradientColors[0], strokeWidth: 1, strokeDasharray: "3 3" }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke={gradientColors[0]} 
                            strokeWidth={3.5}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
