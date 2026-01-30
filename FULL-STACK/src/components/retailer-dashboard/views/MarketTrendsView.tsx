'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, MapPin, Youtube, ShoppingBag, Newspaper, ArrowUpRight, Loader2, ExternalLink } from 'lucide-react'
import { getMarketTrends } from '@/app/actions_trends'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const SUGGESTED_KEYWORDS = ["protein bar", "millets snacks", "sugar free biscuits"]

export function MarketTrendsView() {
    const [query, setQuery] = useState('protein bar')
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchTrends = async (searchQuery: string = query) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await getMarketTrends(searchQuery)
            if (result.success) {
                setData(result)
            } else {
                setError(result.error || 'Failed to fetch trends')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTrends('protein bar')
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchTrends()
    }

    const handleSuggestedClick = (kw: string) => {
        setQuery(kw)
        fetchTrends(kw)
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">Market Intelligence</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent italic">Competitor Price Intelligence</h2>
                <p className="text-zinc-400 max-w-2xl">Detect competitor pricing patterns and compare product rates across major retailers in real-time.</p>
            </div>

            <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter product for price comparison..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium backdrop-blur-md"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        <span>Compare Prices</span>
                    </button>
                </form>

                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Trending:</span>
                    {SUGGESTED_KEYWORDS.map(kw => (
                        <button
                            key={kw}
                            onClick={() => handleSuggestedClick(kw)}
                            className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all"
                        >
                            {kw}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Price Distribution Chart */}
                    <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                                    <TrendingUp className="w-6 h-6" />
                                    Competitor Pricing Index
                                </h3>
                                <p className="text-zinc-500 text-sm mt-1">Price comparison across multiple retail sources</p>
                            </div>
                            {data.isMock && (
                                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-bold border border-yellow-500/20 uppercase tracking-tight">Demo Data</span>
                            )}
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.competitors}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis
                                        dataKey="source"
                                        stroke="#71717a"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#71717a"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `₹${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ color: '#3b82f6' }}
                                        formatter={(val) => [`₹${val}`, 'Price']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Price Metrics Summary */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-gradient-to-br from-zinc-900/40 to-indigo-900/10 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Market Stats</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 text-xs">Lowest Market Price</span>
                                    <span className="text-xl font-bold text-emerald-400">₹{data.pricing_metrics?.min}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 text-xs">Average Market Price</span>
                                    <span className="text-xl font-bold text-white">₹{data.pricing_metrics?.avg}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-zinc-500 text-xs">Highest Market Price</span>
                                    <span className="text-xl font-bold text-rose-400">₹{data.pricing_metrics?.max}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur-xl h-[178px] overflow-y-auto">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-blue-400" />
                                Top Competitive Sources
                            </h4>
                            <div className="space-y-3">
                                {data.competitors?.slice(0, 5).map((c: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-300 font-medium">{c.source}</span>
                                        <span className="text-zinc-500">₹{c.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* All Competitor Comparisons */}
                    <div className="lg:col-span-12 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-white">
                            <Search className="w-6 h-6 text-zinc-400" />
                            Live Market Price Comparisons
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.competitors?.map((c: any, i: number) => {
                                const isLow = c.price <= (data.pricing_metrics?.min * 1.05);
                                const isHigh = c.price >= (data.pricing_metrics?.max * 0.95);

                                return (
                                    <a
                                        key={i}
                                        href={c.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-5 rounded-2xl bg-zinc-800/20 border border-zinc-700/30 hover:border-purple-500/30 hover:bg-zinc-800/40 transition-all group"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                                {c.thumbnail ? (
                                                    <img src={c.thumbnail} alt={c.source} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-zinc-700" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-400 transition-colors uppercase tracking-tight">{c.source}</h4>
                                                <div className="text-lg font-black text-white mt-0.5">₹{c.price}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${isLow ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                isHigh ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {isLow ? 'Aggressive' : isHigh ? 'Premium' : 'Market Avg'}
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="mt-3 text-[10px] text-zinc-500 line-clamp-1 italic">{c.title}</div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* YouTube Trending */}
                    <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Youtube className="w-6 h-6 text-red-500" />
                                Social Sentiment (YouTube)
                            </h3>
                            <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
                                View all <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.videos?.map((v: any, i: number) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-zinc-800">
                                        <img
                                            src={v.thumbnail || `/placeholder-video.jpg`}
                                            alt={v.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                                                <Youtube className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-[10px] font-bold text-white">
                                            {v.views || 'Viral'}
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-zinc-200 line-clamp-1 group-hover:text-white transition-colors">{v.title}</h4>
                                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-bold">
                                        {typeof v.source === 'object' ? v.source.name : (v.source || 'Trending Content')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* News & Signals */}
                    <div className="lg:col-span-12 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Newspaper className="w-6 h-6 text-orange-400" />
                            Market Signals & News
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.news?.map((n: any, i: number) => (
                                <a
                                    key={i}
                                    href={n.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-6 rounded-2xl bg-zinc-800/20 border border-zinc-700/30 hover:border-orange-500/30 hover:bg-zinc-800/40 transition-all group lg:last:hidden xl:last:block"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/10">Signal</span>
                                        <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-relaxed">{n.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                        <span>{typeof n.source === 'object' ? n.source.name : (n.source || 'Market Source')}</span>
                                        <span>•</span>
                                        <span>{n.date || 'Recently'}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && !data && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800/50 shadow-2xl">
                        <Search className="w-10 h-10 text-zinc-700" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-300 mb-2">Ready for Intelligence?</h3>
                    <p className="text-zinc-500 max-w-sm">Enter a keyword above to pull full-spectrum search trends and consumer sentiment data.</p>
                </div>
            )}
        </div>
    )
}
