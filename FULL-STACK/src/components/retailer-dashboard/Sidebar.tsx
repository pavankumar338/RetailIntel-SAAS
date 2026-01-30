import { TrendingUp, LayoutDashboard, Box, BarChart3, Calculator, Users, LogOut, Truck, Sparkles, Search, ShieldAlert } from 'lucide-react'
import { Tab } from './types'

type Props = {
    activeTab: Tab
    setActiveTab: (tab: Tab) => void
    isSidebarOpen: boolean
    profile: any
    handleSignOut: () => void
}

export function Sidebar({ activeTab, setActiveTab, isSidebarOpen, profile, handleSignOut }: Props) {
    return (
        <aside
            className={`relative border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex flex-col z-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
                }`}
        >
            <div className={`flex items-center gap-3 px-4 mb-8 mt-4 ${!isSidebarOpen && 'justify-center'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                {isSidebarOpen && (
                    <div className="animate-in fade-in duration-300">
                        <h1 className="font-bold text-lg tracking-tight">RetailAI</h1>
                        <p className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">Dashboard v2.0</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 space-y-2 px-2">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'home' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                        } ${!isSidebarOpen && 'justify-center'}`}
                >
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    {isSidebarOpen && <span>Home</span>}
                    {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Home</div>}
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'products' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                        } ${!isSidebarOpen && 'justify-center'}`}
                >
                    <Box className="w-5 h-5 shrink-0" />
                    {isSidebarOpen && <span>Products</span>}
                    {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Products</div>}
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'analytics' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                        } ${!isSidebarOpen && 'justify-center'}`}
                >
                    <BarChart3 className="w-5 h-5 shrink-0" />
                    {isSidebarOpen && <span>Analytics</span>}
                    {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Analytics</div>}
                </button>

                <div className="pt-6 pb-2">
                    {isSidebarOpen && <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider px-3 mb-2 animate-in fade-in">Intelligence</div>}
                    <button
                        onClick={() => setActiveTab('predictions')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'predictions' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <TrendingUp className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Predictions</span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Predictions</div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('dynamic_pricing')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative mt-2 ${activeTab === 'dynamic_pricing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Sparkles className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Dynamic Pricing</span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Dynamic Pricing</div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('market_trends')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative mt-2 ${activeTab === 'market_trends' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Search className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Market Trends</span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Market Trends</div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('fraud_detection')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative mt-2 ${activeTab === 'fraud_detection' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm' : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Fraud Detection</span>}
                        {isSidebarOpen && <span className="ml-auto flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Fraud Detection</div>}
                    </button>
                </div>

                <div className="pt-2 pb-2">
                    {isSidebarOpen && <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider px-3 mb-2 animate-in fade-in">Operations</div>}
                    <button
                        onClick={() => setActiveTab('pos')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'pos' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Calculator className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Point of Sale</span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">POS</div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'customers' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Users className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Customers</span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Customers</div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('vendors')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === 'vendors' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                            } ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Truck className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Vendors</span>}
                        {!isSidebarOpen && <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Vendors</div>}
                    </button>
                </div>
            </nav>

            <div className="pt-4 border-t border-zinc-800 px-2 pb-4 space-y-2">
                <div className={`flex items-center gap-3 px-2 py-2 rounded-xl bg-zinc-800/20 border border-zinc-800 ${!isSidebarOpen && 'justify-center'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
                        {profile?.full_name?.[0] || 'R'}
                    </div>
                    {isSidebarOpen && (
                        <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                            <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Retailer'}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{profile?.email || 'Store Owner'}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSignOut}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {isSidebarOpen && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    )
}
