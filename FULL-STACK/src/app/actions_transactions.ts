

import { createClient } from '@/utils/supabase/server'
import { Transaction } from '../components/retailer-dashboard/types'

export async function getCustomerTransactions(phone: string): Promise<{ transactions?: Transaction[], error?: string }> {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Fetch Transactions Error:', error)
        return { error: error.message }
    }

    return { transactions: data as Transaction[] }
}
