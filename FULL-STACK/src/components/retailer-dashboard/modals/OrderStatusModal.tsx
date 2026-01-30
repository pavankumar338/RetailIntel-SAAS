import { CheckCircle, Loader2, XCircle, ArrowRight } from 'lucide-react'

type Props = {
    isOpen: boolean
    onClose: () => void
    status: 'idle' | 'processing' | 'success' | 'error'
    message: string
    details?: {
        amount: number
        customer: string
        method: string
    }
}

export function OrderStatusModal({ isOpen, onClose, status, message, details }: Props) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={status !== 'processing' ? onClose : undefined} />

            <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">

                {status === 'processing' && (
                    <div className="flex flex-col items-center space-y-6 py-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Processing Order</h3>
                            <p className="text-zinc-400 text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-6 w-full py-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                            <CheckCircle className="w-20 h-20 text-emerald-500 relative z-10" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
                            <p className="text-zinc-400 text-sm">{message}</p>
                        </div>

                        {details && (
                            <div className="w-full bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Customer</span>
                                    <span className="text-white font-medium">{details.customer}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Payment Method</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${details.method === 'cash' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                        <span className="text-white font-medium capitalize">{details.method === 'upi' ? 'Online / UPI' : 'Cash'}</span>
                                    </div>
                                </div>
                                <div className="border-t border-zinc-700/50 my-2" />
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-zinc-400">Total Received</span>
                                    <span className="text-emerald-400">₹{details.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                        >
                            Done & Start New Order
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center space-y-4 py-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                            <XCircle className="w-16 h-16 text-red-500 relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Order Failed</h3>
                        <p className="text-red-400/90 text-sm max-w-[280px] bg-red-500/10 p-3 rounded-lg border border-red-500/20">{message}</p>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors mt-2"
                        >
                            Close & Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
