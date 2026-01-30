
'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, AlertTriangle, Activity, Clock, Search, CheckCircle, XCircle, Eye } from 'lucide-react'
import { getFraudAlerts, resolveAlert, type FraudAlert } from '@/app/actions_fraud'

export function FraudDetectionView() {
    const [alerts, setAlerts] = useState<FraudAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null)

    useEffect(() => {
        loadAlerts()
    }, [])

    const loadAlerts = async () => {
        setLoading(true)
        const res = await getFraudAlerts()
        if (res.alerts) {
            setAlerts(res.alerts)
            if (res.alerts.length > 0) setSelectedAlert(res.alerts[0])
        }
        setLoading(false)
    }

    const handleResolve = async (id: string) => {
        await resolveAlert(id)
        setAlerts(prev => prev.filter(a => a.id !== id))
        if (selectedAlert?.id === id) setSelectedAlert(null)
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
        }
    }

    const highRiskCount = alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{highRiskCount}</div>
                        <div className="text-xs text-zinc-400">High Risk Incidents</div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{alerts.length}</div>
                        <div className="text-xs text-zinc-400">Total Flags</div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Activity className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">Active</div>
                        <div className="text-xs text-zinc-400">System Status</div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">Live</div>
                        <div className="text-xs text-zinc-400">Monitoring Mode</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts List */}
                <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <h3 className="font-medium text-white">Recent Alerts</h3>
                        <button onClick={loadAlerts} className="text-xs text-zinc-400 hover:text-white">Refresh</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {loading ? (
                            <div className="p-4 text-center text-zinc-500">Scanning transactions...</div>
                        ) : alerts.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center gap-3 text-zinc-600">
                                <CheckCircle className="w-8 h-8 opacity-50" />
                                <p>No suspicious activity detected.</p>
                            </div>
                        ) : (
                            alerts.map(alert => (
                                <button
                                    key={alert.id}
                                    onClick={() => setSelectedAlert(alert)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedAlert?.id === alert.id
                                        ? 'bg-zinc-800 border-zinc-700 ring-1 ring-zinc-700'
                                        : 'bg-transparent border-transparent hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                        <span className="text-xs text-zinc-500">
                                            {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-white mb-0.5 truncate">{alert.alert_type.replace('_', ' ')}</div>
                                    <div className="text-xs text-zinc-400 truncate">{alert.description}</div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative">
                    {selectedAlert ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-800/20">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`text-xs uppercase font-bold px-2 py-1 rounded border ${getSeverityColor(selectedAlert.severity)}`}>
                                            {selectedAlert.severity} Risk
                                        </div>
                                        <span className="text-zinc-500 text-sm">ID: {selectedAlert.id.slice(0, 8)}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                                        {selectedAlert.alert_type.replace(/_/g, ' ')}
                                    </h2>
                                    <p className="text-zinc-400">{selectedAlert.description}</p>
                                </div>
                                <button
                                    onClick={() => handleResolve(selectedAlert.id)}
                                    className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                                >
                                    Resolve Alert
                                </button>
                            </div>

                            <div className="p-6 space-y-8 overflow-y-auto">


                                {/* Deep Dive Data */}
                                {selectedAlert.details && Object.keys(selectedAlert.details).length > 0 && (
                                    <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Signal Data Points</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {Object.entries(selectedAlert.details).map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                    <div className="text-xs text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                                    <div className="text-sm font-mono text-white">
                                                        {typeof value === 'number' && key.toLowerCase().includes('price')
                                                            ? `₹${value.toFixed(2)}`
                                                            : String(value)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-4">
                            <Search className="w-12 h-12 opacity-20" />
                            <p>Select an alert to view signal analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
