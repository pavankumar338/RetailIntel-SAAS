import { Pencil, Trash2, UserPlus, Truck, Phone, Mail, MapPin } from 'lucide-react'
import { Vendor } from '../types'

type Props = {
    vendors: Vendor[]
    openAddModal: () => void
    handleEdit: (vendor: Vendor) => void
    handleDelete: (id: string) => void
}

export function VendorsView({ vendors, openAddModal, handleEdit, handleDelete }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Vendor Management
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage your suppliers and external partners.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Vendor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vendors.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/30 border border-zinc-800 rounded-3xl border-dashed">
                        <Truck className="w-12 h-12 mb-3 opacity-20" />
                        <p>No vendors found. Add your first supplier to get started.</p>
                    </div>
                ) : (
                    vendors.map(vendor => (
                        <div key={vendor.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-white text-lg">{vendor.name}</h3>
                                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {vendor.status}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(vendor)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(vendor.id)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-zinc-400">
                                {vendor.contact_person && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 flex justify-center"><UserPlus className="w-4 h-4 text-zinc-600" /></div>
                                        <span className="text-zinc-300">{vendor.contact_person}</span>
                                    </div>
                                )}
                                {vendor.phone && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 flex justify-center"><Phone className="w-4 h-4 text-zinc-600" /></div>
                                        <span>{vendor.phone}</span>
                                    </div>
                                )}
                                {vendor.email && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 flex justify-center"><Mail className="w-4 h-4 text-zinc-600" /></div>
                                        <a href={`mailto:${vendor.email}`} className="hover:text-blue-400">{vendor.email}</a>
                                    </div>
                                )}
                                {vendor.address && (
                                    <div className="flex items-start gap-2">
                                        <div className="w-8 flex justify-center mt-0.5"><MapPin className="w-4 h-4 text-zinc-600" /></div>
                                        <span className="line-clamp-2">{vendor.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
