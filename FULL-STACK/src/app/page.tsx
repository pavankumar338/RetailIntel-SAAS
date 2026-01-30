import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Building2, Store, User, LogOut } from 'lucide-react'
import RetailerDashboard from '@/components/RetailerDashboard'
import CustomerDashboard from '@/components/customer-dashboard/CustomerDashboard'

export default async function Dashboard() {
  const supabase = await createClient()

  // 1. Get User
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch Profile
  const { data: dbProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // 3. Construct Effective Profile
  const meta = user.user_metadata
  const profile = dbProfile || {
    id: user.id,
    role: meta.role || 'customer',
    full_name: meta.full_name || 'User',
    email: user.email || meta.email,
    org_name: meta.org_name,
    org_address: meta.org_address,
    phone: meta.phone
  }

  if (!profile) {
    redirect('/login')
  }

  // 4. Fetch Retailer Data (Products)
  let products: any[] = []
  if (profile.role === 'retailer') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('retailer_id', profile.id)
      .order('created_at', { ascending: false })

    if (data) {
      products = data
    } else if (error) {
      console.error("Error fetching products (Table might be missing):", error)
    }
  }

  // 5. Fetch Customers (POS)
  let customers: any[] = []
  if (profile.role === 'retailer') {
    const { data: custData } = await supabase
      .from('pos_customers')
      .select('*')
      .eq('retailer_id', profile.id)
      .order('last_purchase_date', { ascending: false })

    if (custData) customers = custData
  }

  // 6. Fetch Vendors
  let vendors: any[] = []
  if (profile.role === 'retailer') {
    const { data: vendorData } = await supabase
      .from('vendors')
      .select('*')
      .eq('retailer_id', profile.id)
      .order('created_at', { ascending: false })

    if (vendorData) vendors = vendorData
  }

  // 7. Fetch Customer Transactions
  let customerTransactions: any[] = []

  if (profile.role === 'customer') {
    // Try to get phone from profile or metadata
    const rawPhone = profile.phone || meta.phone
    const phone = rawPhone?.replace(/\D/g, '')

    if (phone) {
      // Use Admin Client to bypass RLS if possible
      let dataClient: any | null = null

      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (serviceRoleKey) {
        try {
          const { createClient: createAdminClient } = require('@supabase/supabase-js')
          dataClient = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey)
        } catch (e) {
          console.error("Failed to init admin client:", e)
        }
      } else {
        console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Customer dashboard may show empty results due to RLS.")
      }

      // Fallback to standard client if admin not available
      const clientToUse = dataClient || supabase

      console.log(`[CustomerDashboard] Searching transactions for: ${phone}. ServiceRole: ${!!dataClient ? 'YES' : 'NO (Check env)'}`)

      // 1. Fetch detailed transactions
      // Force exact match if number is clean, or ilike if potentially fuzzy
      // Note: 'transactions' usually has RLS enabling insert for retailers but select for owners.
      // But customers don't 'own' the transaction record in 'user_id' column (that's retailer).
      // They are only referenced in 'customer_phone'.
      // THIS IS WHY RLS FAILS for standard client.

      const { data: transData, error } = await clientToUse
        .from('transactions')
        .select('*')
        .ilike('customer_phone', `%${phone}%`)
        .order('created_at', { ascending: false })

      if (transData) {
        console.log(`[CustomerDashboard] Found ${transData.length} transactions.`)
        customerTransactions = transData
      } else if (error) {
        console.error("[CustomerDashboard] Error fetching transactions:", error)
      }

      // 2. Fetch POS Spend Summary (aggregates from all retailers)
      const { data: posSummary, error: posError } = await clientToUse
        .from('pos_customers')
        .select('total_spend, retailer_id, last_purchase_date')
        .ilike('phone_number', `%${phone}%`)

      if (posSummary) {
        // Calculate total stats
        const totalSpent = posSummary.reduce((sum: number, record: any) => sum + (record.total_spend || 0), 0)
        const storesVisited = posSummary.length

        // Attach to profile for display
        profile.stats = { totalSpent, storesVisited }
      } else if (posError) {
        console.error("Error fetching POS summary:", posError)
      }
    }
  }

  // 7. Render Dashboard based on Role
  if (profile.role === 'retailer') {
    return <RetailerDashboard profile={profile} products={products} customers={customers} vendors={vendors} />
  }

  // 6. Customer / Generic Dashboard View
  return <CustomerDashboard profile={profile} initialTransactions={customerTransactions} />
}
