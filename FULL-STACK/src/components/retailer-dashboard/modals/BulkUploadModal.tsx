import { X, Upload, FileText, Download } from 'lucide-react'

type Props = {
    isBulkModalOpen: boolean
    setIsBulkModalOpen: (open: boolean) => void
    handleBulkUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    isPendingBulk: boolean
    downloadTemplate: () => void
}

export function BulkUploadModal({ isBulkModalOpen, setIsBulkModalOpen, handleBulkUpload, isPendingBulk, downloadTemplate }: Props) {
    if (!isBulkModalOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBulkModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <h3 className="text-lg font-semibold text-white">Import Products (CSV)</h3>
                    <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors group">
                        <div className="mb-4 p-4 bg-zinc-800 rounded-full group-hover:scale-110 transition-transform">
                            {isPendingBulk ? (
                                <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Upload className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                            )}
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-white">Click to upload CSV</p>
                            <p className="text-xs text-zinc-500">or drag and drop</p>
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleBulkUpload}
                            disabled={isPendingBulk}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-blue-200">CSV Format Required</p>
                            <p className="text-xs text-blue-300/70 leading-relaxed">
                                Headers must include: <span className="font-mono bg-blue-500/10 px-1 rounded">name</span>, <span className="font-mono bg-blue-500/10 px-1 rounded">price</span>, <span className="font-mono bg-blue-500/10 px-1 rounded">category</span>.
                                Optional: description, stock, cost, sku, sales, revenue, profit, demand, season, region, month_num, is_festival, discount_percent, is_promo, last_month_sales, avg_temp, rainfall.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={downloadTemplate}
                        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 flex items-center justify-center gap-2 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Download Template CSV
                    </button>
                </div>
            </div>
        </div>
    )
}
