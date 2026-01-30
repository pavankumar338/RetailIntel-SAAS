import { IndianRupee, ShoppingBag, TrendingUp, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { StatCard } from '../components/StatCard'

type Props = {
    totalRevenue: number
    totalProfit: number
    totalViews: number
    monthlySalesData: any[]
    categorySalesData: any[]
    seasonalData: any[]
    topRevenueData: any[]
    COLORS: string[]
}

export function AnalyticsView({
    totalRevenue,
    totalProfit,
    totalViews,
    monthlySalesData,
    categorySalesData,
    seasonalData,
    topRevenueData,
    COLORS
}: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
                <p className="text-sm text-zinc-500">Deep dive into your sales and product metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee className="w-5 h-5 text-emerald-400" />} trend="+8%" />
                <StatCard title="Total Profit" value={`₹${totalProfit.toLocaleString()}`} icon={<ShoppingBag className="w-5 h-5 text-blue-400" />} trend="+2%" />
                <StatCard title="Avg. Demand Score" value="82/100" icon={<TrendingUp className="w-5 h-5 text-purple-400" />} trend="+0.5%" />
                <StatCard title="Total Views" value={totalViews.toLocaleString()} icon={<Eye className="w-5 h-5 text-amber-400" />} trend="+24%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                {/* Monthly Sales Trend */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-base font-medium text-white mb-6">Monthly Sales Trend</h3>
                    <div className="flex-1 min-h-0">
                        {monthlySalesData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No sales data found.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlySalesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#71717a"
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#71717a"
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: '#27272a' }}
                                    />
                                    <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={30}>
                                        {monthlySalesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-base font-medium text-white mb-6">Category Distribution (Sales)</h3>
                    <div className="flex-1 min-h-0">
                        {categorySalesData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No sales data found.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categorySalesData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80} // Reduced for safety responsiveness
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categorySalesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                {/* Seasonal Analysis */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-base font-medium text-white mb-6">Seasonal Sales Analysis</h3>
                    <div className="flex-1 min-h-0">
                        {seasonalData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No seasonal data found.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={seasonalData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#71717a"
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#71717a"
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: '#27272a' }}
                                    />
                                    <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40}>
                                        {seasonalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Top 5 Products by Revenue */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-base font-medium text-white mb-6">Top 5 Products by Revenue</h3>
                    <div className="flex-1 min-h-0">
                        {topRevenueData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No revenue data.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topRevenueData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={120}
                                        stroke="#71717a"
                                        tick={{ fill: '#71717a', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: '#27272a' }}
                                        formatter={(value: any) => `₹${value.toLocaleString()}`}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
