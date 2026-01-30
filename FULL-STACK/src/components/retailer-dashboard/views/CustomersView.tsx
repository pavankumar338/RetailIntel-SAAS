import { Pencil } from 'lucide-react'
import { Customer } from '../types'

type Props = {
    customers: Customer[]
    setEditingCustomer: (cust: Customer) => void
    setIsCustomerModalOpen: (open: boolean) => void
    onViewTransactions: (cust: Customer) => void
}

export function CustomersView({
    customers,
    setEditingCustomer,
    setIsCustomerModalOpen,
    onViewTransactions
}: Props) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950/50 uppercase text-xs font-semibold text-zinc-500">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Total Spend</th>
                            <th className="px-6 py-4">Last Visit</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                    No customers found. Make sales via POS to see customers here.
                                </td>
                            </tr>
                        ) : (
                            customers.map((cust) => (
                                <tr key={cust.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td
                                        className="px-6 py-4 font-medium text-white cursor-pointer hover:text-blue-400 group"
                                        onClick={() => onViewTransactions(cust)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div>
                                                {cust.name || 'Guest'}
                                                {cust.email && <div className="text-[10px] text-zinc-500 group-hover:text-blue-500/70">{cust.email}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{cust.phone_number}</td>
                                    <td className="px-6 py-4 font-mono text-emerald-400 font-bold">₹{cust.total_spend.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {new Date(cust.last_purchase_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onViewTransactions(cust)}
                                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View History
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCustomer(cust)
                                                setIsCustomerModalOpen(true)
                                            }}
                                            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
