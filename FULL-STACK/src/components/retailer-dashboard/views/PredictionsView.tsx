import { TrendingUp } from 'lucide-react'
import { Product } from '../types'

type Props = {
    filterCategory: string
    setFilterCategory: (cat: string) => void
    uniqueCategories: string[]
    filteredProducts: Product[]
}

export function PredictionsView({
    filterCategory,
    setFilterCategory,
    uniqueCategories,
    filteredProducts
}: Props) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                        Seasonal Sales Forecasting
                    </h2>
                    <p className="text-sm text-zinc-500">AI-powered predictions for your seasonal inventory.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => alert("Run 'python Predictions/prediction.py' in your terminal to update these values.")}
                        className="px-4 py-2 bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Run Prediction Model
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900/80 uppercase text-xs font-semibold text-zinc-500">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Season</th>
                            <th className="px-6 py-4">Current Sales</th>
                            <th className="px-6 py-4">Predicted Sales</th>
                            <th className="px-6 py-4">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {filteredProducts.map((product) => {
                            const pred = Math.round(product.predicted_sales || 0)
                            const delta = pred - product.sales_count
                            const isPositive = delta > 0
                            return (
                                <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {product.name}
                                        <div className="text-[10px] text-zinc-500">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-800 rounded text-xs">{product.season || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{product.sales_count}</td>
                                    <td className="px-6 py-4 font-mono text-purple-400 font-bold text-base">
                                        {pred}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-amber-500'}`}>
                                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                            {delta > 0 ? '+' : ''}{delta} units
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">No products found for this category.</div>
                )}
            </div>
        </div>
    )
}
