'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import {
    Loader2, Phone, Lock, Store, User, Building2, ArrowRight, Smartphone, Mail,
    BarChart3, Brain, Zap, Shield, CheckCircle2, LayoutDashboard, TrendingUp,
    Package, ShoppingCart, CreditCard, LineChart, Receipt, Users, Search, Menu,
    MoreHorizontal, Wallet, RefreshCcw, DollarSign, Calendar, PieChart, Plus
} from 'lucide-react'

// --- Feature Showcase & Mocks ---

const features = [
    {
        id: 'products',
        label: 'Products',
        description: 'Effortlessly manage your entire inventory with support for variants, categories, and real-time stock tracking.',
        icon: Package,
        color: 'blue',
        image: '/features/products.png'
    },
    {
        id: 'pos',
        label: 'Point of Sale',
        description: 'Process transactions in seconds with our lightning-fast, touch-friendly POS interface designed for modern retail.',
        icon: ShoppingCart,
        color: 'purple',
        image: '/features/pos.jpeg'
    },
    {
        id: 'payments',
        label: 'Payments',
        description: 'Accept every payment method including Credit Cards, UPI, and Digital Wallets with instant reconciliation.',
        icon: CreditCard,
        color: 'green',
        image: '/features/payments.png'
    },
    {
        id: 'forecasting',
        label: 'Forecasting',
        description: 'AI-powered demand prediction helps you stock the right products at the right time, maximizing revenue.',
        icon: TrendingUp,
        color: 'orange',
        image: '/features/forecast.jpeg'
    },
    {
        id: 'billing',
        label: 'Billing',
        description: 'Generate professional digital and physical invoices instantly with automated tax calculations.',
        icon: Receipt,
        color: 'pink',
        image: '/features/billing.jpeg'
    },
    {
        id: 'customers',
        label: 'Customers Management',
        description: 'Build lasting relationships with detailed customer profiles, purchase history, and loyalty programs.',
        icon: Users,
        color: 'cyan',
        image: '/features/customer.png'
    },
]

function FeatureShowcase() {
    return (
        <div className="flex flex-col gap-24 py-12">
            {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                    <div
                        key={feature.id}
                        className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    >
                        {/* Text Content */}
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className={`inline-flex p-3 rounded-2xl bg-${feature.color}-500/10 mb-2 ring-1 ring-${feature.color}-500/20`}>
                                <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                {feature.label}
                            </h3>
                            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {feature.description}
                            </p>

                        </div>

                        {/* Image/Visual Content */}
                        <div className="flex-1 w-full relative perspective-1000 group">
                            <div className={`absolute -inset-4 bg-gradient-to-r from-${feature.color}-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 ring-1 ring-white/5 transform group-hover:scale-[1.02] group-hover:-rotate-1 transition-all duration-500">
                                <div className="aspect-[16/10] bg-zinc-900 relative">
                                    <img
                                        src={feature.image}
                                        alt={feature.label}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay Gradient for better blending */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Mocks removed in favor of image showcase

export default function AuthPage() {
    const [userType, setUserType] = useState<'customer' | 'retailer'>('customer')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage(null)

        try {
            if (userType === 'customer') {
                const phone = formData.get('phone') as string
                if (!phone) throw new Error('Phone number is required')

                const cleanPhone = phone.replace(/\D/g, '')
                if (cleanPhone.length < 10) throw new Error('Invalid phone number')

                const email = `${cleanPhone}@internal.app`
                formData.set('email', email)
            } else {
                const emailInput = formData.get('email') as string
                if (!emailInput) throw new Error('Email is required')
            }

            formData.set('role', userType)

            if (isLogin) {
                const result = await login(formData)
                if (result?.error) {
                    let errorMsg = result.error
                    if (result.error.includes('Invalid login credentials') || result.error.includes('Invalid credentials')) {
                        errorMsg = 'Invalid credentials. If you just signed up, please verify your email.'
                    }
                    setMessage({ type: 'error', text: errorMsg })
                }
            } else {
                const result = await signup(formData)
                if (result?.error) {
                    setMessage({ type: 'error', text: result.error })
                } else if (result?.success && result?.message) {
                    setMessage({ type: 'success', text: result.message })
                }
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30 flex flex-col">

            {/* Fixed Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 group cursor-pointer">
                        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                            RetailIntel
                        </span>
                    </div>
                    {/* Optional Nav Links could go here */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Login</button>
                        <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Features</button>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-16">
                {/* Hero Section */}
                <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                    {/* Dynamic Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center">
                        {/* Hero Content */}
                        <div className="text-center max-w-5xl mx-auto mb-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer mx-auto">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                v2.0 Now Available
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-tight">
                                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-zinc-500 drop-shadow-2xl pb-2">
                                    Retail Intel
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
                                Transform your business with <span className="text-blue-400 font-medium">AI-driven inventory tracking</span>, <span className="text-purple-400 font-medium">real-time sales analytics</span>, and <span className="text-pink-400 font-medium">predictive customer insights</span>.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 justify-center pt-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-900/80 backdrop-blur border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-blue-500/30 transition-all">
                                    <Brain className="w-4 h-4 text-blue-400" />
                                    <span>AI Predictions</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-900/80 backdrop-blur border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-purple-500/30 transition-all">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                    <span>Growth Analytics</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-900/80 backdrop-blur border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-pink-500/30 transition-all">
                                    <Shield className="w-4 h-4 text-pink-400" />
                                    <span>Enterprise Security</span>
                                </div>
                            </div>
                        </div>

                        {/* Login Card */}
                        <div className="w-full max-w-md perspective-1000 relative z-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                            {/* Glow Effect behind card */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur-2xl opacity-20 animate-pulse-slow pointer-events-none"></div>

                            <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 lg:p-8 ring-1 ring-white/5 relative group transition-all duration-500">
                                {/* Decoration */}
                                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                {/* Login Header inside card */}
                                <div className="mb-8 text-center">
                                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                                    <p className="text-sm text-zinc-500">Access your intelligent dashboard</p>
                                </div>

                                {/* User Type Toggle */}
                                <div className="grid grid-cols-2 p-1.5 border border-zinc-800/50 bg-zinc-950/50 rounded-xl mb-6">
                                    <button
                                        onClick={() => setUserType('customer')}
                                        className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${userType === 'customer'
                                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        <User className="w-4 h-4" />
                                        Customer
                                    </button>
                                    <button
                                        onClick={() => setUserType('retailer')}
                                        className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${userType === 'retailer'
                                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        <Store className="w-4 h-4" />
                                        Retailer
                                    </button>
                                </div>

                                {/* Auth Mode Toggle */}
                                <div className="flex bg-zinc-950/30 rounded-lg p-1 mb-6 border border-zinc-800/50">
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${isLogin
                                            ? 'bg-blue-600/10 text-blue-400'
                                            : 'text-zinc-600 hover:text-zinc-400'
                                            }`}
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${!isLogin
                                            ? 'bg-purple-600/10 text-purple-400'
                                            : 'text-zinc-600 hover:text-zinc-400'
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                <form action={handleSubmit} className="space-y-4">
                                    <div className="space-y-4 min-h-[140px]">
                                        {userType === 'customer' ? (
                                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                                {!isLogin && (
                                                    <div className="group">
                                                        <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Full Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                                            <input
                                                                name="full_name"
                                                                type="text"
                                                                required
                                                                placeholder="John Doe"
                                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="group">
                                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Phone Number</label>
                                                    <div className="relative">
                                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                                        <input
                                                            name="phone"
                                                            type="tel"
                                                            required
                                                            placeholder="123 456 7890"
                                                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="group">
                                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                                        <input
                                                            name="email"
                                                            type="email"
                                                            required
                                                            placeholder="retailer@company.com"
                                                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {!isLogin && (
                                                    <>
                                                        <div className="group animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Organization Name</label>
                                                            <div className="relative">
                                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                                                <input
                                                                    name="org_name"
                                                                    type="text"
                                                                    required={!isLogin}
                                                                    placeholder="Company Name"
                                                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="group animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                                                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Address</label>
                                                            <div className="relative">
                                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                                                <input
                                                                    name="org_address"
                                                                    type="text"
                                                                    required={!isLogin}
                                                                    placeholder="Business Address"
                                                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <div className="group">
                                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Password</label>
                                            <div className="relative">
                                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors ${userType === 'customer' ? 'group-focus-within:text-blue-400' : 'group-focus-within:text-purple-400'}`} />
                                                <input
                                                    name="password"
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    placeholder="••••••••"
                                                    className={`w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 transition-all ${userType === 'customer' ? 'focus:ring-blue-500/20 focus:border-blue-500/50' : 'focus:ring-purple-500/20 focus:border-purple-500/50'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 animate-in slide-in-from-top-2 ${message.type === 'error'
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'error' ? 'bg-red-400' : 'bg-green-400'}`} />
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 text-white overflow-hidden relative group/btn ${userType === 'customer'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-900/20'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-purple-900/20'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                                        ) : (
                                            <div className="flex items-center gap-2 relative z-10">
                                                <span>{isLogin ? (userType === 'customer' ? 'Login with Phone' : 'Login as Retailer') : 'Create Account'}</span>
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </div>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-zinc-900/30 border-y border-white/5 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Powerful features for modern retail</h2>
                            <p className="text-zinc-400 text-lg">We provide the tools you need to optimize operations and delight your customers, all in one platform.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-800/50 transition-all group duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                                    <Brain className="w-7 h-7 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Forecasting</h3>
                                <p className="text-zinc-400 leading-relaxed">Predict demand with 90% accuracy using our advanced machine learning algorithms. Never overstock or understock again.</p>
                            </div>
                            {/* Feature 2 */}
                            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 hover:bg-zinc-800/50 transition-all group duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
                                    <BarChart3 className="w-7 h-7 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">Real-Time Analytics</h3>
                                <p className="text-zinc-400 leading-relaxed">Monitor sales, inventory levels, and staff performance in real-time from any device, anywhere in the world.</p>
                            </div>
                            {/* Feature 3 */}
                            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-pink-500/30 hover:bg-zinc-800/50 transition-all group duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 group-hover:scale-110 transition-all">
                                    <Smartphone className="w-7 h-7 text-pink-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">Smart POS</h3>
                                <p className="text-zinc-400 leading-relaxed">A lightning-fast Point of Sale inspired by modern e-commerce experiences. Integrated payments and digital receipts.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Product Features Section */}
                <section className="py-24 relative overflow-hidden bg-zinc-950/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            {/* Headers Removed */}
                        </div>

                        <FeatureShowcase />
                    </div>
                </section>
            </main>



            <footer className="py-12 border-t border-white/5 bg-zinc-950 text-zinc-500 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="bg-zinc-800 p-1.5 rounded-lg">
                                <Store className="w-4 h-4 text-zinc-400" />
                            </div>
                            <span className="text-zinc-300 font-semibold tracking-tight">RetailIntel</span>
                        </div>
                        <div className="flex flex-wrap gap-8 text-sm font-medium">
                            <a href="#" className="hover:text-blue-400 transition-colors">Product</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Solutions</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Pricing</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
                        </div>
                        <div className="flex gap-4">
                            {/* Social placeholders */}
                            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer">
                                <Mail size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                        <p>&copy; {new Date().getFullYear()} RetailIntel Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    )
}
