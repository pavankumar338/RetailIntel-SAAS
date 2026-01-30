'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
    Package,
    Calendar,
    CreditCard,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    Store,
    Receipt,
    Download
} from 'lucide-react'
import { Transaction } from '@/components/retailer-dashboard/types'

interface TransactionListProps {
    transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl border-dashed">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl border border-zinc-800">
                    <ShoppingBag className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                <p className="text-sm text-zinc-400 text-center max-w-xs leading-relaxed">
                    Purchases made with your phone number <br />
                    <span className="text-zinc-500 font-mono text-xs"> (verified at checkout) </span><br />
                    will appear here automatically.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.transaction_id || Math.random().toString()} transaction={transaction} />
            ))}
        </div>
    )
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Calculate total items count
    const itemCount = transaction.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling the accordion

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = `
            <html>
            <head>
                <title>Invoice #${transaction.transaction_id?.slice(0, 8)}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
                    .brand { font-size: 24px; font-weight: bold; color: #111827; }
                    .invoice-id { font-size: 14px; color: #6b7280; margin-top: 5px; }
                    .meta { text-align: right; font-size: 14px; color: #4b5563; }
                    .table-container { margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { text-align: left; border-bottom: 2px solid #e5e7eb; padding: 12px 8px; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600; }
                    td { border-bottom: 1px solid #f3f4f6; padding: 16px 8px; font-size: 14px; }
                    .total-section { display: flex; justify-content: flex-end; margin-top: 20px; border-top: 2px solid #f3f4f6; padding-top: 20px; }
                    .total-row { display: flex; justify-content: space-between; width: 200px; margin-bottom: 10px; }
                    .total-row.final { font-weight: bold; font-size: 18px; color: #111827; border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
                    .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="brand">RETAIL INTEL</div>
                        <div class="invoice-id">Invoice #${transaction.transaction_id?.slice(0, 8)}</div>
                    </div>
                    <div class="meta">
                        <div><strong>Date:</strong> ${transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A'}</div>
                        <div><strong>Time:</strong> ${transaction.created_at ? new Date(transaction.created_at).toLocaleTimeString() : 'N/A'}</div>
                        <div style="margin-top: 10px;"><strong>Payment:</strong> ${(transaction.payment_method || 'Cash').toUpperCase()}</div>
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 50%;">Item Description</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Price</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${transaction.items?.map((item: any) => `
                                <tr>
                                    <td>
                                        <div style="font-weight: 500; color: #111827;">${item.name}</div>
                                    </td>
                                    <td style="text-align: center;">${item.quantity}</td>
                                    <td style="text-align: right;">₹${item.price?.toLocaleString()}</td>
                                    <td style="text-align: right; font-weight: 500;">₹${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="total-section">
                    <div>
                        <div class="total-row final">
                            <span>Total</span>
                            <span>₹${transaction.total?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>This is a computer generated invoice.</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }

    return (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/50 transition-all duration-300">
            {/* Header / Summary */}
            <div
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">Order #{transaction.transaction_id?.slice(0, 8) || 'ID-MISSING'}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wide border border-emerald-500/20">
                                Completed
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {transaction.created_at ? format(new Date(transaction.created_at), 'PPP p') : 'Date N/A'}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-zinc-700" />
                            <div className="flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" />
                                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0">
                    <div className="text-right">
                        <p className="text-xs text-zinc-500 mb-0.5">Total Amount</p>
                        <p className="text-lg font-bold text-white">₹{transaction.total?.toLocaleString()}</p>
                    </div>
                    <button className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${isExpanded ? 'bg-white/5' : ''}`}>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-zinc-800/50 bg-zinc-900/20 p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">

                    {/* Items List */}
                    <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Items Purchased</h4>
                        <div className="grid gap-3">
                            {transaction.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-500">
                                            {item.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{item.name}</p>
                                            <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-300">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment & Footer */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 pt-2 md:pt-4 border-t border-zinc-800/50">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <CreditCard className="w-4 h-4" />
                            <span>Paid via <span className="text-zinc-300 font-medium capitalize">{transaction.payment_method?.replace('_', ' ') || 'Unknown'}</span></span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download Invoice
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors">
                                <Store className="w-3.5 h-3.5" />
                                View Store
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
