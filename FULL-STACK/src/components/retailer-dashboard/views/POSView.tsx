import { Package, ShoppingBag, ShoppingCart, MinusCircle, PlusCircle, X, CreditCard, Banknote, Landmark } from 'lucide-react'
import Script from 'next/script'
import { Product } from '../types'
import { CartItem } from '@/app/actions'

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
    filteredProducts: Product[]
    addToCart: (product: Product) => void
    cart: CartItem[]
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, delta: number) => void
    cartTotal: number
    handleProcessOrder: () => void
    isProcessing: boolean
    customerPhone: string
    setCustomerPhone: (phone: string) => void
    paymentMethod: 'cash' | 'upi'
    setPaymentMethod: (method: 'cash' | 'upi') => void
    customerName: string
    setCustomerName: (name: string) => void
    customerEmail: string
    setCustomerEmail: (email: string) => void
    setCartItemQuantity: (id: string, quantity: number) => void
    updatePrice: (id: string, price: number) => void
}

export function POSView({
    filterCategory,
    setFilterCategory,
    filterSeason,
    setFilterSeason,
    filterMonth,
    setFilterMonth,
    uniqueCategories,
    uniqueSeasons,
    uniqueMonths,
    filteredProducts,
    addToCart,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    handleProcessOrder,
    isProcessing,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    setCartItemQuantity,
    updatePrice
}: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
            {/* Product Selection */}
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 bg-zinc-900/20 rounded-2xl border border-zinc-800 p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-medium text-white">Select Products</h3>
                    <div className="flex gap-2">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat === 'All' ? 'Categories' : cat}</option>
                            ))}
                        </select>
                        <select
                            value={filterSeason}
                            onChange={(e) => setFilterSeason(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {uniqueSeasons.map(s => (
                                <option key={s} value={s}>{s === 'All' ? 'Seasons' : s}</option>
                            ))}
                        </select>
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {uniqueMonths.map(m => (
                                <option key={m} value={m}>{m === 'All' ? 'Months' : m}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-2">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={product.stock_quantity <= 0}
                            className={`flex flex-col text-left p-4 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-xl transition-all ${product.stock_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            <div className="w-full aspect-square bg-zinc-900 rounded-lg mb-3 flex items-center justify-center text-zinc-700">
                                <Package className="w-8 h-8" />
                            </div>
                            <div className="font-medium text-white truncate w-full">{product.name}</div>
                            <div className="text-xs text-zinc-500 mb-2 truncate w-full">{product.category}</div>
                            <div className="mt-auto flex items-center justify-between w-full">
                                <span className="font-mono text-emerald-400">₹{product.price}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${product.stock_quantity > 0 ? 'bg-zinc-700 text-zinc-300' : 'bg-red-500/20 text-red-400'}`}>
                                    {product.stock_quantity > 0 ? `${product.stock_quantity} left` : 'Out'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-400" />
                        Current Order
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 opacity-50">
                            <ShoppingCart className="w-12 h-12" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-xl border border-zinc-700/50">
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="font-medium text-white truncate">{item.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center bg-zinc-900 rounded border border-zinc-700 px-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                                            <span className="text-zinc-500 text-xs">₹</span>
                                            <input
                                                type="number"
                                                className="w-14 bg-transparent border-none text-xs text-white p-1 focus:outline-none"
                                                value={item.price}
                                                onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="text-xs text-zinc-500">x {item.quantity}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><MinusCircle className="w-4 h-4" /></button>
                                    <input
                                        type="number"
                                        className="w-10 bg-zinc-900 border border-zinc-700 rounded text-center text-sm text-white py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={item.quantity}
                                        onChange={(e) => setCartItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                        min="1"
                                    />
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><PlusCircle className="w-4 h-4" /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="ml-3 p-2 text-zinc-500 hover:text-red-400 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-4">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'cash'
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            <Banknote className="w-5 h-5" />
                            <span className="font-medium">Cash</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'upi'
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            <Landmark className="w-5 h-5" />
                            <span className="font-medium">UPI / Online</span>
                        </button>
                    </div>
                    {/* Customer Info Inputs */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-500">Customer Mobile <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-500">Customer Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="Enter customer name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-500">Customer Email (Optional)</label>
                            <input
                                type="email"
                                placeholder="Enter customer email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400 text-sm">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-white text-xl font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleProcessOrder}
                        disabled={isProcessing || cart.length === 0}
                        className={`w-full py-3 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${paymentMethod === 'cash'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 text-white'
                            }`}
                    >
                        {isProcessing ? (
                            <>Processing...</>
                        ) : (
                            <>
                                {paymentMethod === 'cash' ? <Banknote className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                {paymentMethod === 'cash' ? 'Record Cash Sale' : 'Pay Online'}
                            </>
                        )}
                    </button>

                    {paymentMethod === 'upi' && (
                        <div className="pt-2 text-center border-t border-zinc-800">
                            <p className="text-xs text-zinc-500 mb-2">Or scan this Personal QR Code directly if the above fails:</p>
                            <div className="flex flex-col items-center gap-2">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://razorpay.me/@kodepavankumar`}
                                    className="w-32 h-32 rounded-lg bg-white p-2"
                                    alt="Payment QR"
                                />
                                <a
                                    href="https://razorpay.me/@kodepavankumar"
                                    target="_blank"
                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                    Open Payment Page
                                </a>
                            </div>
                        </div>
                    )}
                    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
                </div>
            </div>
        </div>
    )
}
