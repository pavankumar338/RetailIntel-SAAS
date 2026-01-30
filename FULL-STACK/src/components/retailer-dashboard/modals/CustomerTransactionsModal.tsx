import { X, Receipt, Calendar, CreditCard, Box, User, Phone, Mail, AlertCircle, Store, IndianRupee, Clock } from 'lucide-react'
import { Transaction, Customer } from '../types'
import { format } from 'date-fns'

type Props = {
    isOpen: boolean
    onClose: () => void
    transactions: Transaction[]
    customer: Customer | null
    isLoading: boolean
}

export function CustomerTransactionsModal({ isOpen, onClose, transactions, customer, isLoading }: Props) {
    if (!isOpen || !customer) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            Customer Profile
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">View and manage customer details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent space-y-6">

                    {/* Top Stats & Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Profile Card */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <User className="w-5 h-5 text-blue-400" />
                                </div>
                                <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Your Profile</h4>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-1">Account Type</label>
                                    <div className="text-sm font-medium text-white bg-zinc-800/50 inline-block px-3 py-1 rounded-full border border-zinc-700/50">
                                        Customer
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-500 block mb-1">Customer ID</label>
                                    <div className="text-xs font-mono text-zinc-400 break-all">
                                        {customer.id}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-zinc-500 block mb-1">Phone for Orders</label>
                                        <div className="text-sm font-medium text-white flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-zinc-500" />
                                            {customer.phone_number}
                                        </div>
                                    </div>
                                    {customer.email && (
                                        <div>
                                            <label className="text-xs text-zinc-500 block mb-1">Email</label>
                                            <div className="text-sm font-medium text-white flex items-center gap-2 truncate">
                                                <Mail className="w-3 h-3 text-zinc-500" />
                                                {customer.email}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 flex gap-3 text-xs text-yellow-500/80">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>If orders are missing, ensure the retailer used this exact phone number at checkout.</p>
                                </div>
                            </div>
                        </div>

                        {/* Activity Card */}
                        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <IndianRupee className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Your Activity</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                                    <label className="text-xs text-zinc-500 block mb-1">Lifetime Spend</label>
                                    <div className="text-2xl font-bold text-white">
                                        ₹{customer.total_spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                                    <label className="text-xs text-zinc-500 block mb-1">Stores Visited</label>
                                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                                        1
                                        <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded ml-auto">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center justify-between text-sm p-3 bg-zinc-800/30 rounded-xl">
                                    <span className="text-zinc-400 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Last Visit
                                    </span>
                                    <span className="text-white font-medium">
                                        {customer.last_purchase_date ? new Date(customer.last_purchase_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Never'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-purple-400" />
                                Order History
                            </h3>
                            <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                {transactions.length} Orders
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="text-zinc-500 text-sm">Retrieving order history...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-zinc-500 space-y-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                                <ShoppingBag className="w-12 h-12 opacity-20" />
                                <p>No orders recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <div key={tx.transaction_id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all duration-200 group">
                                        {/* Transaction Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 border-b border-zinc-800/50 pb-3">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.payment_method === 'cash' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {tx.payment_method === 'cash' ? <IndianRupee className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-white font-medium flex items-center gap-2">
                                                        Transaction
                                                        <span className="text-zinc-500 font-normal text-xs font-mono">#{tx.transaction_id.slice(0, 8)}</span>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(tx.created_at), 'MMM d, yyyy • h:mm a')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white">₹{tx.total.toFixed(2)}</div>
                                                <div className="text-xs text-zinc-500">
                                                    {tx.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} items • {tx.payment_method.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compact Items List */}
                                        <div className="bg-zinc-950/50 rounded-lg p-3 space-y-2">
                                            {tx.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-zinc-300">
                                                        <Box className="w-3 h-3 text-zinc-600" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-zinc-500 text-xs font-mono">
                                                        <span>{item.quantity} x ₹{item.price}</span>
                                                        <span className="text-zinc-400 w-14 text-right">₹{(item.quantity * item.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions if needed, for now empty or simple close */}
                {/* <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors">
                        Close
                    </button>
                </div> */}
            </div>
        </div>
    )
}

function ShoppingBag({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}
