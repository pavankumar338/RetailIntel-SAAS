'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createVendor(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const name = formData.get('name') as string
    const contact_person = formData.get('contact_person') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const status = formData.get('status') as string || 'Active'

    if (!name) return { error: 'Vendor name is required' }

    const { error } = await supabase
        .from('vendors')
        .insert({
            retailer_id: user.id,
            name,
            contact_person,
            phone,
            email,
            address,
            status
        })

    if (error) {
        console.error('Create Vendor Error:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true, message: 'Vendor added successfully' }
}

export async function updateVendor(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const contact_person = formData.get('contact_person') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const status = formData.get('status') as string

    const { error } = await supabase
        .from('vendors')
        .update({
            name,
            contact_person,
            phone,
            email,
            address,
            status
        })
        .eq('id', id)
        .eq('retailer_id', user.id)

    if (error) {
        console.error('Update Vendor Error:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true, message: 'Vendor updated successfully' }
}

export async function deleteVendor(vendorId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId)
        .eq('retailer_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/')
    return { success: true }
}
