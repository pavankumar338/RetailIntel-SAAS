
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type FraudAlert = {
    id: string
    transaction_id: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    alert_type: string
    description: string
    details: any
    created_at: string
}

export async function getFraudAlerts() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .eq('retailer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Fetch Alerts Error:', error)
        return { error: error.message }
    }

    return { alerts: data as FraudAlert[] }
}

export async function resolveAlert(alertId: string) {
    const supabase = await createClient()
    // In a real app, we might mark it as resolved instead of deleting
    // For now, let's just delete it to "clear" it
    const { error } = await supabase
        .from('fraud_alerts')
        .delete()
        .eq('id', alertId)

    if (error) return { error: error.message }

    revalidatePath('/')
    return { success: true }
}
