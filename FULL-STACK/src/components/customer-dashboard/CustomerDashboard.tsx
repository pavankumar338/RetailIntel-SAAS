'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, LogOut, TrendingUp, ShoppingBag, Clock, FileText, Smartphone } from 'lucide-react'
import TransactionList from './TransactionList'
import { useRouter } from 'next/navigation'
import { getCustomerTransactions, getCustomerStats } from '@/app/actions_customer'

interface CustomerDashboardProps {
    profile: any
    initialTransactions: any[]
}

export default function CustomerDashboard({ profile, initialTransactions }: CustomerDashboardProps) {
    const [transactions, setTransactions] = useState(initialTransactions)
    const [stats, setStats] = useState(profile.stats || { totalSpent: 0, storesVisited: 0 })
    const router = useRouter()
    const supabase = createClient()

    // Polling for real-time updates (since RLS restricts direct client subscription for customers)
    useEffect(() => {
        const phone = profile.phone || profile.user_metadata?.phone
        if (!phone) return

        const fetchLatest = async () => {
            try {
                const freshTransactions = await getCustomerTransactions(phone)
                if (freshTransactions) {
                    setTransactions(freshTransactions)
                }

                const freshStats = await getCustomerStats(phone)
                if (freshStats) {
                    setStats(freshStats)
                }
            } catch (err) {
                console.error("Polling error:", err)
            }
        }

        // Poll every 10 seconds
        const interval = setInterval(fetchLatest, 10000)

        // Also run once on mount to ensure freshness
        fetchLatest()

        return () => clearInterval(interval)
    }, [profile])


    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            RetailIntel <span className="text-blue-500 text-xs uppercase tracking-widest font-medium ml-1">Customer</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700/50">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            LIVE UPDATES
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white group relative"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

                {/* Header Welcome */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800/50">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{profile.full_name || 'Shopper'}</span>
                        </h1>
                        <p className="text-zinc-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Here's your shopping activity overview
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Registered Phone</p>
                        <p className="font-mono text-zinc-300 bg-zinc-900 px-3 py-1 rounded border border-zinc-800 inline-block">
                            {profile.phone || profile.user_metadata?.phone || 'N/A'}
                        </p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Spend */}
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/60 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-24 h-24 text-blue-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <p className="text-sm text-zinc-500 font-medium mb-1">Total Lifetime Spend</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">
                                ₹{stats.totalSpent?.toLocaleString()}
                            </h3>
                        </div>
                    </div>

                    {/* Stores Visited */}
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/60 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShoppingBag className="w-24 h-24 text-purple-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                                <ShoppingBag className="w-5 h-5 text-purple-400" />
                            </div>
                            <p className="text-sm text-zinc-500 font-medium mb-1">Stores Visited</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">
                                {stats.storesVisited} <span className="text-lg text-zinc-600 font-medium">Locations</span>
                            </h3>
                        </div>
                    </div>

                    {/* Quick Profile */}
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/60 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 md:col-span-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                                    <User className="w-5 h-5 text-emerald-400" />
                                </div>
                                <p className="text-sm text-zinc-500 font-medium mb-1">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Active Member</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex flex-col items-end">
                                    <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider mb-1">Member Since</span>
                                    <span className="text-xs text-zinc-400 font-mono bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                        {new Date().getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Transactions */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                Recent Orders
                            </h2>
                            <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                Showing last {transactions.length} orders
                            </span>
                        </div>

                        <TransactionList transactions={transactions} />
                    </div>

                    {/* Right Column: Promos/Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-b from-blue-900/20 to-zinc-900/40 border border-blue-500/20 rounded-2xl p-5">
                            <h3 className="text-lg font-bold text-white mb-2">New Feature! 🚀</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                You can now see your bills in <span className="text-blue-400 font-medium">Real-Time</span>. As soon as a cashier generates your bill, it pops up here!
                            </p>
                            <div className="w-full bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-blue-400" />
                                <span className="text-xs text-blue-200">Instant Digital Receipts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
