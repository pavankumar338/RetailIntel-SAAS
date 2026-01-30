import { Pencil, Trash2 } from 'lucide-react'
import { Product } from '../types'

type Props = {
    products: Product[]
    showActions: boolean
    onEdit?: (p: Product) => void
    onDelete?: (id: string) => void
}

export function ProductTable({ products, showActions, onEdit, onDelete }: Props) {
    return (
        <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-900/80 uppercase text-xs font-semibold text-zinc-500">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stats</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    {showActions && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                            {product.custom_product_id ? (
                                <span className="text-zinc-400">{product.custom_product_id}</span>
                            ) : (
                                <span title={product.id}>{product.id.slice(0, 5)}...</span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                            {product.name}
                            <div className="text-[10px] text-zinc-500 flex gap-2">
                                <span>{product.season}</span>
                                {product.month && <span>• {product.month.slice(0, 3)}</span>}
                                {product.region && <span>• {product.region}</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-zinc-800 rounded text-xs">
                                {product.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">
                            <div className="flex flex-col gap-1">
                                <span className="text-emerald-400">R: ₹{product.total_revenue?.toLocaleString()}</span>
                                <span className="text-blue-400">S: {product.sales_count}</span>
                                {product.demand_score && product.demand_score > 0 && <span className="text-purple-400">D: {product.demand_score}</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-300">
                            ₹{product.price}
                            <div className="text-[10px] text-zinc-600">Cost: ₹{product.cost_per_unit || 0}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? 'bg-emerald-500' : product.stock_quantity > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                {product.stock_quantity}
                            </div>
                        </td>
                        {showActions && (
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit?.(product)}
                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(product.id)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
