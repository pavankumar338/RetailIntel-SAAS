import { Search, LayoutDashboard, Menu, ChevronLeft } from 'lucide-react'
import { Tab } from './types'

type Props = {
    isSidebarOpen: boolean
    setIsSidebarOpen: (isOpen: boolean) => void
    activeTab: Tab
}

export function Header({ isSidebarOpen, setIsSidebarOpen, activeTab }: Props) {
    return (
        <header className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-2 duration-500 relative z-10 sticky top-0 bg-transparent backdrop-blur-sm -mx-8 px-8 py-4 -mt-8 border-b border-white/5">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div>
                    <h2 className={`text-2xl font-bold tracking-tight ${activeTab === 'home' ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : 'text-white'}`}>
                        {activeTab === 'home' && 'Retail Intelligence'}
                        {activeTab === 'products' && 'Product Inventory'}
                        {activeTab === 'analytics' && 'Performance Analytics'}
                        {activeTab === 'predictions' && 'AI Predictions'}
                        {activeTab === 'pos' && 'Point of Sale'}
                        {activeTab === 'customers' && 'Customer Management'}
                        {activeTab === 'market_trends' && 'Market Intelligence'}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 hidden sm:block">
                        {activeTab === 'home' && 'Transform your retail business with AI-powered analytics and smart inventory management'}
                        {activeTab === 'products' && 'Manage your catalog and stock levels'}
                        {activeTab === 'analytics' && 'Deep dive into your sales metrics'}
                        {activeTab === 'predictions' && 'Forecast future demand with AI'}
                        {activeTab === 'pos' && 'Process customer transactions efficiently'}
                        {activeTab === 'customers' && 'View and manage your loyal customers'}
                        {activeTab === 'market_trends' && 'Real-time search intelligence and consumer interest patterns'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" placeholder="Search..." className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64 transition-all" />
                </div>
                <button className="w-9 h-9 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                </button>
            </div>
        </header>
    )
}
