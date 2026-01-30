import { Plus, Upload, Package } from 'lucide-react'
import { ProductTable } from '../components/ProductTable'
import { Product } from '../types'

type Props = {
    filterCategory: string
    setFilterCategory: (cat: string) => void
    filterSeason: string
    setFilterSeason: (season: string) => void
    filterMonth: string
    setFilterMonth: (month: string) => void
    uniqueCategories: string[]
    uniqueSeasons: string[]
    uniqueMonths: string[]
    openAddModal: () => void
    setIsBulkModalOpen: (open: boolean) => void
    filteredProducts: Product[]
    handleEdit: (product: Product) => void
    handleDelete: (id: string) => void
}

export function ProductsView({
    filterCategory,
    setFilterCategory,
    filterSeason,
    setFilterSeason,
    filterMonth,
    setFilterMonth,
    uniqueCategories,
    uniqueSeasons,
    uniqueMonths,
    openAddModal,
    setIsBulkModalOpen,
    filteredProducts,
    handleEdit,
    handleDelete
}: Props) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Product Inventory</h2>
                    <p className="text-sm text-zinc-500">Manage your catalog, stock, and pricing.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 flex-wrap justify-end">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                        ))}
                    </select>
                    <select
                        value={filterSeason}
                        onChange={(e) => setFilterSeason(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {uniqueSeasons.map(s => (
                            <option key={s} value={s}>{s === 'All' ? 'All Seasons' : s}</option>
                        ))}
                    </select>
                    <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {uniqueMonths.map(m => (
                            <option key={m} value={m}>{m === 'All' ? 'All Months' : m}</option>
                        ))}
                    </select>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg flex items-center gap-2 text-sm font-medium transition-all justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-all border border-zinc-700 justify-center"
                    >
                        <Upload className="w-4 h-4" />
                        Bulk Upload
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm min-h-[400px]">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
                        <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-zinc-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white">No products found for this category</h3>
                            <p className="text-zinc-500 text-sm">Add a product or change the filter.</p>
                        </div>
                    </div>
                ) : (
                    <ProductTable products={filteredProducts} showActions={true} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>
        </div>
    )
}
