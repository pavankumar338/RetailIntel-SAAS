'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function getCustomerTransactions(phone: string) {
    if (!phone) return []

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) return []

    // Try to init admin client to bypass RLS issues for customers viewing retailer records
    // As noted in page.tsx, customers don't "own" the transaction rows.
    let clientToUse: any = null
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (serviceRoleKey) {
        try {
            clientToUse = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
        } catch (e) {
            console.error("Failed to init admin client:", e)
        }
    }

    if (!clientToUse) {
        // Fallback to standard client (might return empty if RLS is strict)
        clientToUse = await createClient()
    }

    const { data, error } = await clientToUse
        .from('transactions')
        .select('*')
        .ilike('customer_phone', `%${cleanPhone}%`)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error("Error fetching transactions:", error)
        return []
    }

    return data
}

export async function getCustomerStats(phone: string) {
    if (!phone) return null

    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) return null

    // Admin client setup
    let clientToUse: any = null
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (serviceRoleKey) {
        try {
            clientToUse = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
        } catch (e) {
            console.error("Failed to init admin client:", e)
        }
    }
    if (!clientToUse) clientToUse = await createClient()

    // Fetch stats
    const { data: posSummary, error } = await clientToUse
        .from('pos_customers')
        .select('total_spend, retailer_id, last_purchase_date')
        .ilike('phone_number', `%${cleanPhone}%`)

    if (error) {
        console.error("Error fetching stats:", error)
        return null
    }

    if (posSummary) {
        const totalSpent = posSummary.reduce((sum: number, record: any) => sum + (record.total_spend || 0), 0)
        const storesVisited = posSummary.length
        return { totalSpent, storesVisited }
    }

    return null
}
