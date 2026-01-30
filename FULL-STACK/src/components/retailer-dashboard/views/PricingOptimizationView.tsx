import { useState, useMemo } from 'react'
import { TrendingUp, ArrowRight, Sparkles, RefreshCw, CheckCircle2, Loader2, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, BrainCircuit } from 'lucide-react'
import { Product } from '../types'
import { applyDynamicPrice, bulkApplyDynamicPrices } from '@/app/actions'
import { useRouter } from 'next/navigation'

type Props = {
    products: Product[]
}

type SuggestedAction = {
    productId: string
    productName: string
    currentPrice: number
    suggestedPrice: number
    changePercent: number
    reason: string
    action: string
    confidence: number
    type: 'increase' | 'decrease' | 'clearance' | 'optimized'
    isAISuggestion: boolean
}

export function PricingOptimizationView({ products }: Props) {
    const [optimizationEnabled, setOptimizationEnabled] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [isBulkUpdating, setIsBulkUpdating] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const router = useRouter()

    // Combined Logic: Preference to AI Script Output, Fallback to Heuristics
    const suggestions: SuggestedAction[] = useMemo(() => {
        if (!optimizationEnabled) return []

        return products.map(product => {
            // Case 1: Use AI-Based Price Optimization from Python Model
            if (product.suggested_price && product.suggested_price !== product.price) {
                const diff = product.suggested_price - product.price
                const diffPct = (diff / product.price) * 100

                return {
                    productId: product.id,
                    productName: product.name,
                    currentPrice: product.price,
                    suggestedPrice: product.suggested_price,
                    changePercent: diffPct,
                    reason: product.pricing_reason || "Mathematically optimized for maximum profit margin based on current demand trends.",
                    action: diff > 0 ? "Profit Max" : "Volume Boost",
                    confidence: 0.94,
                    type: diff > 0 ? 'increase' : 'decrease',
                    isAISuggestion: true
                } as SuggestedAction
            }

            // Case 2: Heuristic Fallback (Original logic for products without AI data yet)
            const basePrice = product.price
            const stock = product.stock_quantity
            const sales = product.sales_count || 0
            const createdAt = new Date(product.created_at)
            const now = new Date()
            const daysInStock = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)))
            const salesPerDay = sales / daysInStock

            if (daysInStock > 30 && salesPerDay < 0.2 && stock > 5) {
                return {
                    productId: product.id,
                    productName: product.name,
                    currentPrice: basePrice,
                    suggestedPrice: basePrice * 0.85,
                    changePercent: -15,
                    reason: `Low velocity (${salesPerDay.toFixed(2)}/day). High stock age.`,
                    action: "Inventory Liquidation",
                    confidence: 0.85,
                    type: 'clearance',
                    isAISuggestion: false
                } as SuggestedAction
            }

            return null
        }).filter(Boolean) as SuggestedAction[]
    }, [products, optimizationEnabled])

    const handleApplyPrice = async (productId: string, newPrice: number) => {
        setUpdatingId(productId)
        setStatus(null)
        try {
            const res = await applyDynamicPrice(productId, newPrice)
            if (res.success) {
                setStatus({ type: 'success', message: res.message || 'Price updated!' })
                setTimeout(() => setStatus(null), 3000)
                router.refresh()
            } else {
                setStatus({ type: 'error', message: res.error || 'Failed to update price' })
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'An unexpected error occurred' })
        } finally {
            setUpdatingId(null)
        }
    }

    const handleBulkApply = async () => {
        if (suggestions.length === 0) return
        setIsBulkUpdating(true)
        setStatus(null)

        try {
            const updates = suggestions.map(s => ({ id: s.productId, price: s.suggestedPrice }))
            const res = await bulkApplyDynamicPrices(updates)

            if (res.success) {
                setStatus({ type: 'success', message: res.message || 'All prices updated!' })
                setTimeout(() => setStatus(null), 3000)
                router.refresh()
            } else {
                setStatus({ type: 'error', message: res.error || 'Bulk update failed' })
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'An unexpected error occurred' })
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const handleRefreshUI = () => {
        router.refresh()
        // Simple visual feedback
        setStatus({ type: 'success', message: 'Refreshing data...' })
        setTimeout(() => setStatus(null), 2000)
    }

    return (
        <div className="space-y-8 pb-10">
            {status && (
                <div className={`fixed top-8 right-8 z-[100] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-right-10 duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    <div className="flex items-center gap-3">
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        <span className="text-sm font-semibold">{status.message}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">AI Dynamic Pricing</h2>
                    </div>

                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => alert("Run 'python Predictions/pricing_optimizer.py' in your terminal to sync the latest AI insights.")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all shadow-xl"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retrain Model
                    </button>
                    <button
                        onClick={handleRefreshUI}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all shadow-xl"
                        title="Refresh UI Data"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-sm">
                        <button
                            onClick={() => setOptimizationEnabled(true)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${optimizationEnabled ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <Sparkles className={`w-4 h-4 ${optimizationEnabled ? 'text-purple-600' : ''}`} />
                            AI Enable
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {suggestions.length === 0 ? (
                    <div className="col-span-full bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-[2.5rem] py-24 text-center">
                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-inner">
                            <BrainCircuit className="w-10 h-10 text-zinc-700" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">No Optimization Signals Found</h4>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed"> Run the training script to generate new AI-based pricing intelligence.</p>
                    </div>
                ) : (
                    suggestions.map((s, i) => (
                        <div key={i} className="group relative bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-500 flex flex-col shadow-2xl">
                            <div className={`absolute -inset-px rounded-[2rem] transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none blur-xl ${s.type === 'increase' ? 'bg-emerald-500/5' : s.type === 'clearance' ? 'bg-orange-500/5' : 'bg-blue-500/5'
                                }`} />

                            <div className="relative">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors truncate max-w-[150px]">
                                                {s.productName}
                                            </h4>
                                            {s.isAISuggestion && (
                                                <div className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[9px] font-black text-purple-400 uppercase tracking-tighter">
                                                    AI Trained
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.action}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight ${s.type === 'increase' ? 'bg-emerald-500/10 text-emerald-400' :
                                        s.type === 'clearance' ? 'bg-orange-500/10 text-orange-400' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {s.type === 'increase' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                        {Math.abs(s.changePercent).toFixed(1)}%
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 mb-6 min-h-[80px]">
                                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                                        "{s.reason}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Current</span>
                                        <div className="text-2xl font-black text-white/50 line-through decoration-zinc-700 tracking-tighter decoration-2">
                                            ₹{s.currentPrice.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Suggested</span>
                                        <div className="text-3xl font-black text-white tracking-tighter">
                                            ₹{s.suggestedPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="text-zinc-500 uppercase">Model Confidence</span>
                                        <span className="text-purple-400">{Math.round(s.confidence * 100)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                            style={{ width: `${s.confidence * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-3">
                                    <button
                                        disabled={updatingId === s.productId}
                                        onClick={() => handleApplyPrice(s.productId, s.suggestedPrice)}
                                        className="flex-1 h-12 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
                                    >
                                        {updatingId === s.productId ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Deploy AI Choice
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {suggestions.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-10">
                    <div className="flex gap-10 items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-500/10 rounded-2xl">
                                <BrainCircuit className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">AI Logic</div>
                                <div className="text-sm font-black text-white">XGBoost Regression</div>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-zinc-800" />
                        <div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Insights</div>
                            <div className="text-2xl font-black text-white">{suggestions.length}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleBulkApply}
                        disabled={isBulkUpdating}
                        className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-black rounded-[1.25rem] transition-all shadow-xl shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isBulkUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Bulk Apply AI Choices'}
                    </button>
                </div>
            )}
        </div>
    )
}
