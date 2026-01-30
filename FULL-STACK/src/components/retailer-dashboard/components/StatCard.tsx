import { TrendingUp } from 'lucide-react'

type Props = {
    title: string
    value: string | number
    icon: any
    trend: string
}

export function StatCard({ title, value, icon, trend }: Props) {
    return (
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex items-start justify-between group hover:border-zinc-700 transition-all">
            <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
                <div className="text-2xl font-bold text-white font-mono">{value}</div>
                {trend && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {trend} vs last month
                    </div>
                )}
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    )
}
