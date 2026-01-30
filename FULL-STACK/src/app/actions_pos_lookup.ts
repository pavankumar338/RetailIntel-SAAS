
'use server'

import { createClient } from '@/utils/supabase/server'

export async function findCustomerByPhone(phone: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const cleanPhone = phone.replace(/\D/g, '')

    // 1. Try to find in retailer's POS customers first (preferred)
    const { data: posCustomer } = await supabase
        .from('pos_customers')
        .select('*')
        .eq('retailer_id', user.id)
        .eq('phone_number', cleanPhone)
        .single()

    if (posCustomer) {
        return {
            found: true,
            source: 'pos_customer',
            customer: {
                name: posCustomer.name,
                email: posCustomer.email,
                phone: posCustomer.phone_number
            }
        }
    }

    // 2. If not in POS list, check global profiles
    // Note: 'profiles' table usually has 'id', 'role', 'full_name', 'phone', etc.
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('phone', cleanPhone)
        .single()

    if (profile) {
        return {
            found: true,
            source: 'profile',
            customer: {
                name: profile.full_name,
                email: profile.email,
                phone: profile.phone // assuming 'phone' column exists and is used for lookup
            }
        }
    }

    return { found: false }
}


