import { useState, useEffect } from 'react'
import { X, IndianRupee, BarChart3 } from 'lucide-react'
import { Product, ActionState } from '../types'

type Props = {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    editingProduct: Product | null
    handleSubmit: (formData: FormData) => void
    state: ActionState
    hasSubmitted: boolean
    isPending: boolean
}

export function ProductModal({ isModalOpen, setIsModalOpen, editingProduct, handleSubmit, state, hasSubmitted, isPending }: Props) {
    // Internal state for smart autofill
    const [month, setMonth] = useState(editingProduct?.month || '')
    const [monthNum, setMonthNum] = useState(editingProduct?.month_num || '')
    const [season, setSeason] = useState(editingProduct?.season || '')

    // Effect to reset state when editingProduct changes
    useEffect(() => {
        setMonth(editingProduct?.month || '')
        setMonthNum(editingProduct?.month_num || '')
        setSeason(editingProduct?.season || '')
    }, [editingProduct])

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = e.target.value
        setMonth(selectedMonth)

        // 1. Auto-set Month Num
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const idx = months.indexOf(selectedMonth)
        if (idx !== -1) {
            const num = idx + 1
            setMonthNum(num)

            // 2. Auto-set Season (Matching Python Logic: 3-6 Summer, 7-10 Monsoon, 11-2 Winter)
            if ([3, 4, 5, 6].includes(num)) {
                setSeason('Summer')
            } else if ([7, 8, 9, 10].includes(num)) {
                setSeason('Monsoon')
            } else {
                setSeason('Winter')
            }
        }
    }

    if (!isModalOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">

                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors" type="button">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-6">
                    {state?.error && hasSubmitted && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                            {state.error}
                        </div>
                    )}
                    {state?.success && hasSubmitted && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg">
                            {state.message}
                        </div>
                    )}

                    <input type="hidden" name="id" value={editingProduct?.id || ''} />
                    <div className="space-y-4">

                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="name">Product Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    defaultValue={editingProduct?.name}
                                    type="text"
                                    required
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-zinc-600"
                                    placeholder="e.g. Wireless Headphones"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="custom_product_id">Product ID (Optional)</label>
                                <input
                                    id="custom_product_id"
                                    name="custom_product_id"
                                    defaultValue={editingProduct?.custom_product_id}
                                    type="text"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="SKU-1234"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="category">Category</label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        defaultValue={editingProduct?.category}
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                                    >
                                        <option value="" disabled selected={!editingProduct?.category}>Select Category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Home">Home</option>
                                        <option value="Beauty">Beauty</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Financials & Stock */}
                        <div className="p-4 bg-zinc-800/20 rounded-2xl border border-zinc-800 space-y-4">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <IndianRupee className="w-3 h-3" /> Financials & Stock
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price / Unit (₹)</label>
                                    <input name="price" defaultValue={editingProduct?.price} type="number" step="0.01" required className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Cost / Unit (₹)</label>
                                    <input name="cost_per_unit" defaultValue={editingProduct?.cost_per_unit} type="number" step="0.01" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Profit (₹)</label>
                                    <input name="profit" defaultValue={editingProduct?.profit} type="number" step="0.01" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Optional" />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Stock Available</label>
                                    <input name="stock_quantity" type="number" defaultValue={editingProduct?.stock_quantity ?? 0} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Units Sold</label>
                                    <input name="sales_count" type="number" defaultValue={editingProduct?.sales_count ?? 0} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Total Revenue (₹)</label>
                                    <input name="total_revenue" defaultValue={editingProduct?.total_revenue} type="number" step="0.01" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Optional" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Expiry Date (Optional)</label>
                                    <input name="expiry_date" type="date" defaultValue={editingProduct?.expiry_date?.split('T')[0]} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Analytics / Meta */}
                        <div className="p-4 bg-zinc-800/20 rounded-2xl border border-zinc-800 space-y-4">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <BarChart3 className="w-3 h-3" /> Predictive Data
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Season</label>
                                    <select
                                        name="season"
                                        value={season}
                                        onChange={(e) => setSeason(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                                    >
                                        <option value="">Select Season</option>
                                        <option value="Summer">Summer</option>
                                        <option value="Monsoon">Monsoon</option>
                                        <option value="Winter">Winter</option>
                                        <option value="Spring">Spring</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Month</label>
                                    <select
                                        name="month"
                                        value={month}
                                        onChange={handleMonthChange}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                                    >
                                        <option value="">Select Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Month Num (1-12)</label>
                                    <input
                                        name="month_num"
                                        value={monthNum}
                                        onChange={(e) => setMonthNum(parseInt(e.target.value) || 0)}
                                        type="number"
                                        min="1"
                                        max="12"
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Discount %</label>
                                    <input name="discount_percent" defaultValue={editingProduct?.discount_percent} type="number" step="0.01" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                </div>
                                <div className="flex flex-col gap-2 pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input name="is_festival" defaultChecked={editingProduct?.is_festival} type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-800/50 text-purple-600 focus:ring-purple-500/50" />
                                        <span className="text-xs font-medium text-zinc-400">Is Festival?</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input name="is_promo" defaultChecked={editingProduct?.is_promo} type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-800/50 text-purple-600 focus:ring-purple-500/50" />
                                        <span className="text-xs font-medium text-zinc-400">Is Promo?</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Demand Score (0-100)</label>
                                    <input name="demand_score" defaultValue={editingProduct?.demand_score} type="number" min="0" max="100" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Region</label>
                                    <select name="region" defaultValue={editingProduct?.region} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none">
                                        <option value="">Select Region</option>
                                        <option value="North America">North America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia">Asia</option>
                                        <option value="South America">South America</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Oceania">Oceania</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                            <textarea
                                name="description"
                                defaultValue={editingProduct?.description || ''}
                                rows={2}
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-zinc-600 resize-none"
                                placeholder="Describe the product..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4 -mx-6 -mb-6 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 bg-white text-black font-medium text-sm rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
