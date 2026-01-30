import { X } from 'lucide-react'
import { Customer } from '../types'

type Props = {
    isCustomerModalOpen: boolean
    setIsCustomerModalOpen: (open: boolean) => void
    editingCustomer: Customer | null
    customerFormAction: (formData: FormData) => void
}

export function CustomerModal({ isCustomerModalOpen, setIsCustomerModalOpen, editingCustomer, customerFormAction }: Props) {
    if (!isCustomerModalOpen || !editingCustomer) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCustomerModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-white">Edit Customer</h3>
                    <button onClick={() => setIsCustomerModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={customerFormAction} className="p-6 space-y-4">
                    <input type="hidden" name="id" value={editingCustomer.id} />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Name</label>
                        <input type="text" name="name" defaultValue={editingCustomer.name || ''} placeholder="Customer Name" className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-zinc-600" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Email (Optional)</label>
                        <input type="email" name="email" defaultValue={editingCustomer.email || ''} placeholder="customer@example.com" className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-zinc-600" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Phone</label>
                        <input type="tel" name="phone_number" defaultValue={editingCustomer.phone_number} required className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-zinc-600" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
