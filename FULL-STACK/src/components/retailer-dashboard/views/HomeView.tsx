import {
    Sparkles,
    Brain,
    BarChart3,
    Package,
    TrendingUp,
    Zap,
    ShieldCheck,
    IndianRupee,
    ShoppingBag,
    FileText,
    Plus
} from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { ProductTable } from '../components/ProductTable'
import { Product } from '../types'

type Props = {
    products: Product[]
    totalProducts: number
    totalSales: number
    totalViews: number
    totalRevenue: number
    totalProfit: number
    categories: Record<string, number>
    openAddModal: () => void
}

export function HomeView({
    products,
    totalProducts,
    totalSales,
    totalViews,
    totalRevenue,
    totalProfit,
    categories,
    openAddModal
}: Props) {
    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl p-px bg-black">
                <div className="relative bg-black rounded-[23px] p-8 md:p-10 overflow-hidden">
                    {/* Decorative background glows */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zinc-600/10 rounded-full blur-[100px]" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="space-y-6 flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium uppercase tracking-wider shadow-sm shadow-purple-900/20">
                                <Sparkles className="w-3 h-3" />
                                Retail Intel
                            </div>

                            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Powering the future of <br />
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent filter drop-shadow-lg">Retail Analytics</span>
                            </h3>

                            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
                                Retail Intel  is a comprehensive retail analytics platform designed to help small and medium-sized businesses make data-driven decisions. Our advanced analytics and AI-powered insights provide you with the tools you need to optimize inventory, predict demand, and maximize profitability.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300 flex items-center gap-2">
                                    <Brain className="w-3 h-3 text-purple-400" />
                                    AI Predictions
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300 flex items-center gap-2">
                                    <BarChart3 className="w-3 h-3 text-blue-400" />
                                    Smart Analytics
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300 flex items-center gap-2">
                                    <Package className="w-3 h-3 text-emerald-400" />
                                    Inventory Control
                                </div>
                            </div>
                        </div>

                        {/* Visual Element */}
                        <div className="hidden md:flex items-center justify-center relative pr-8">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-6 opacity-40 blur-md" />
                                <div className="relative w-full h-full bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
                                    <TrendingUp className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                                </div>
                                {/* Floating elements */}
                                <div className="absolute -right-6 -bottom-4 p-3 bg-zinc-800/90 backdrop-blur rounded-xl border border-zinc-700 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                    <Package className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="absolute -left-6 -top-4 p-3 bg-zinc-800/90 backdrop-blur rounded-xl border border-zinc-700 shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                    <Brain className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Features Section */}
                <div className="pt-4 pb-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-100" />
                            Platform Features
                        </h3>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Core Capabilities</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Real-time Analytics */}
                        <div className="group relative p-px rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-blue-500/50 hover:to-indigo-500/50 transition-all duration-500">
                            <div className="relative h-full bg-black rounded-[15px] p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/10 group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Zap className="w-6 h-6 text-blue-400" />
                                </div>

                                <h4 className="text-white font-semibold mb-2 group-hover:text-blue-200 transition-colors">Real-time Analytics</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Monitor your sales, revenue, and inventory levels in real-time with our high-performance dashboard.
                                </p>
                            </div>
                        </div>

                        {/* Predictive AI Models */}
                        <div className="group relative p-px rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-500">
                            <div className="relative h-full bg-black rounded-[15px] p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-purple-500/10 group-hover:scale-110 transition-transform duration-300 group-hover:border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <Brain className="w-6 h-6 text-purple-400" />
                                </div>

                                <h4 className="text-white font-semibold mb-2 group-hover:text-purple-200 transition-colors">Predictive AI Models</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Leverage advanced machine learning algorithms to forecast seasonal demand and optimize stock.
                                </p>
                            </div>
                        </div>

                        {/* Secure & Reliable */}
                        <div className="group relative p-px rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-emerald-500/50 hover:to-teal-500/50 transition-all duration-500">
                            <div className="relative h-full bg-black rounded-[15px] p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/10 group-hover:scale-110 transition-transform duration-300 group-hover:border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                </div>

                                <h4 className="text-white font-semibold mb-2 group-hover:text-emerald-200 transition-colors">Secure & Reliable</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Enterprise-grade security ensures your business data is always protected and available when you need it.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Products" value={totalProducts} icon={<Package className="w-5 h-5 text-blue-400" />} trend="+12%" />
                    <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee className="w-5 h-5 text-emerald-400" />} trend="+8%" />
                    <StatCard title="Total Profit" value={`₹${totalProfit.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5 text-purple-400" />} trend="+24%" />
                    <StatCard title="Total Sales Units" value={totalSales.toLocaleString()} icon={<ShoppingBag className="w-5 h-5 text-amber-400" />} trend="+5%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Selling Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Top Selling Items
                        </h3>
                        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden">
                            {products.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">No sales data available.</div>
                            ) : (
                                <ProductTable products={[...products].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 5)} showActions={false} />
                            )}
                        </div>

                        <h3 className="text-lg font-medium text-white flex items-center gap-2 pt-4">
                            <Package className="w-5 h-5 text-blue-500" />
                            Top Stocked Items
                        </h3>
                        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden">
                            {products.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">No inventory data available.</div>
                            ) : (
                                <ProductTable products={[...products].sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0)).slice(0, 5)} showActions={false} />
                            )}
                        </div>
                    </div>

                    {/* Sales Order Summary (Right Column) */}
                    <div className="space-y-6">
                        <div className="bg-black border border-zinc-800 rounded-2xl p-6 space-y-6">
                            <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Sales Order Summary
                            </h4>
                            <div className="space-y-4">
                                {/* Mini Summary Cards */}
                                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                                    <div className="text-xs text-zinc-500">Highest Revenue Product</div>
                                    <div className="text-sm font-medium text-white truncate pt-1">
                                        {[...products].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))[0]?.name || 'N/A'}
                                    </div>
                                    <div className="text-xs text-emerald-400 font-mono pt-1">
                                        ₹{[...products].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))[0]?.total_revenue?.toLocaleString() || '0'}
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                                    <div className="text-xs text-zinc-500">Most Popular Category</div>
                                    <div className="text-sm font-medium text-white truncate pt-1">
                                        {Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-800 my-4" />

                                <h4 className="text-sm font-medium text-zinc-400">Quick Actions</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={openAddModal}
                                        className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-xl text-sm text-blue-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New Product
                                    </button>
                                    <button className="p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl text-sm text-zinc-300 transition-colors border border-zinc-700/50 flex items-center justify-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Export Reports
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
