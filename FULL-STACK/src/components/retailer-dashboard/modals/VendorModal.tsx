import { X } from 'lucide-react'
import { Vendor } from '../types'

type Props = {
    isOpen: boolean
    onClose: () => void
    editingVendor: Vendor | null
    handleSubmit: (formData: FormData) => void
    state: any
    isPending: boolean
}

export function VendorModal({ isOpen, onClose, editingVendor, handleSubmit, state, isPending }: Props) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-white">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-4">
                    {editingVendor && <input type="hidden" name="id" value={editingVendor.id} />}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Vendor Name <span className="text-red-500">*</span></label>
                        <input name="name" defaultValue={editingVendor?.name} required placeholder="e.g. Acme Supplies" className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Contact Person</label>
                            <input name="contact_person" defaultValue={editingVendor?.contact_person || ''} placeholder="John Doe" className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Status</label>
                            <select name="status" defaultValue={editingVendor?.status || 'Active'} className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Phone</label>
                            <input name="phone" type="tel" defaultValue={editingVendor?.phone || ''} placeholder="+1 234..." className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Email</label>
                            <input name="email" type="email" defaultValue={editingVendor?.email || ''} placeholder="vendor@example.com" className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Address</label>
                        <textarea name="address" defaultValue={editingVendor?.address || ''} rows={3} placeholder="Full address..." className="w-full bg-zinc-800 border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" />
                    </div>

                    {state?.error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isPending} className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50">
                            {isPending ? 'Saving...' : 'Save Vendor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
