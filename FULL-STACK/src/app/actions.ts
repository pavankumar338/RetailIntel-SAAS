'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import Razorpay from 'razorpay'
import { FraudDetectionEngine, TransactionContext } from '@/utils/fraud-engine'

export async function upsertProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'You must be logged in to manage products.' }
    }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const cost_per_unit = parseFloat(formData.get('cost_per_unit') as string) || 0
    const category = formData.get('category') as string
    const product_type = formData.get('product_type') as string || 'Physical'
    const stock_quantity = parseInt(formData.get('stock_quantity') as string) || 0
    const sales_count = parseInt(formData.get('sales_count') as string) || 0

    // Analytics / ML Fields
    const season = formData.get('season') as string
    const month = formData.get('month') as string
    const month_num = parseInt(formData.get('month_num') as string) || 0
    const is_festival = formData.get('is_festival') === 'on'
    const is_promo = formData.get('is_promo') === 'on'
    const discount_percent = parseFloat(formData.get('discount_percent') as string) || 0

    const total_revenue = parseFloat(formData.get('total_revenue') as string) || 0
    const profit = parseFloat(formData.get('profit') as string) || 0
    const demand_score = parseFloat(formData.get('demand_score') as string) || 0
    const custom_product_id = formData.get('custom_product_id') as string
    const region = formData.get('region') as string
    const expiry_date = formData.get('expiry_date') as string
    const image_url = formData.get('image_url') as string

    if (!name || isNaN(price) || !category) {
        return { error: 'Please fill in all required fields (Name, Price, Category).' }
    }

    const productData = {
        retailer_id: user.id,
        name,
        description,
        price,
        cost_per_unit,
        category,
        product_type,
        stock_quantity,
        sales_count,
        season,
        month,
        month_num,
        is_festival,
        is_promo,
        discount_percent,

        total_revenue,
        profit,
        demand_score,
        custom_product_id,
        region,
        expiry_date: expiry_date || null,
        image_url: image_url || null,
    }

    let error;

    if (id) {
        // Update
        const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .eq('retailer_id', user.id)
        error = updateError
    } else {
        // Create
        const { error: insertError } = await supabase
            .from('products')
            .insert({ ...productData, views_count: 0 })
        error = insertError
    }

    if (error) {
        console.error('Upsert Product Error:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true, message: id ? 'Product updated successfully!' : 'Product created successfully!' }
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'You must be logged in to delete a product.' }
    }

    const { error } = await supabase.from('products').delete().eq('id', productId).eq('retailer_id', user.id)

    if (error) {
        console.error('Delete Product Error:', error)
        return { error: error.message }
    }
    revalidatePath('/')
    return { success: true }
}

export async function bulkCreateProducts(prevState: any, products: any[]) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'You must be logged in to upload products.' }
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
        return { error: 'No product data provided.' }
    }

    // Map and sanitize
    const productsToInsert = products.map(p => ({
        retailer_id: user.id,
        name: p.name,
        description: p.description || null,
        price: parseFloat(p.price) || 0,
        cost_per_unit: parseFloat(p.cost_per_unit) || 0,
        category: p.category || 'Other',
        stock_quantity: parseInt(p.stock_quantity) || 0,
        sales_count: parseInt(p.sales_count) || 0,
        total_revenue: parseFloat(p.total_revenue) || 0,
        profit: parseFloat(p.profit) || 0,
        demand_score: parseInt(p.demand_score) || 0,
        season: p.season || null,
        month: p.month || null,
        month_num: parseInt(p.month_num) || 0,
        is_festival: p.is_festival === true || p.is_festival === 'true',
        is_promo: p.is_promo === true || p.is_promo === 'true',
        discount_percent: parseFloat(p.discount_percent) || 0,
        region: p.region || null,
        custom_product_id: p.custom_product_id || null,
        created_at: new Date().toISOString(),
        views_count: 0
    }))

    const { error } = await supabase.from('products').insert(productsToInsert)

    if (error) {
        console.error('Bulk Create Error:', error)
        return { error: 'Failed to import products: ' + error.message }
    }

    revalidatePath('/')
    return { success: true, message: `Successfully imported ${products.length} products.` }
}

export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
}

export async function processOrder(items: CartItem[], customerPhone: string, paymentMethod: string, customerName?: string, customerEmail?: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'You must be logged in to process orders.' }
    }

    if (!items || items.length === 0) {
        return { error: 'Cart is empty.' }
    }

    // Process each item transactionally effectively
    const errors: string[] = []
    const originalPrices: Record<string, number> = {}

    for (const item of items) {
        // Fetch current product to get stock
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock_quantity, sales_count, total_revenue, profit, cost_per_unit, price, name')
            .eq('id', item.id)
            .single()

        if (fetchError || !product) {
            errors.push(`Product ${item.name} not found or accessible.`)
            continue
        }

        // Store original price for fraud detection
        originalPrices[item.id] = product.price

        if (product.stock_quantity < item.quantity) {
            errors.push(`Insufficient stock for ${item.name}. Available: ${product.stock_quantity}`)
            continue
        }

        // Calculate new stats
        const newStock = product.stock_quantity - item.quantity
        const newSales = (product.sales_count || 0) + item.quantity
        const revenue = (product.total_revenue || 0) + (item.price * item.quantity)

        // Calculate Profit
        // Profit for this sale = (SellingPrice - CostPrice) * Quantity
        const costPrice = product.cost_per_unit || 0
        const profitFromSale = (item.price - costPrice) * item.quantity
        const newProfit = (product.profit || 0) + profitFromSale

        // Update product
        const { error: updateError } = await supabase
            .from('products')
            .update({
                stock_quantity: newStock,
                sales_count: newSales,
                total_revenue: revenue,
                profit: newProfit
            })
            .eq('id', item.id)

        if (updateError) {
            errors.push(`Failed to update ${item.name}: ${updateError.message}`)
        } else {
            // Low Stock Alert
            if (newStock < 10 && user.email) {
                // Determine if we should send an email (e.g., maybe only if it just crossed the threshold or every time?)
                // Requirement: "if the stock is less than 10 ... email notification should sent"
                // We'll send it every time a sale pushes it below 10 or keeps it below 10.
                try {
                    // We don't await this to keep the UI snappy? 
                    // Next.js server actions in serverless might terminate if we don't await.
                    // Let's await to be safe, or use `waitUntil` not available here easily without context.
                    // We'll import dynamically or at top.
                    const { sendLowStockEmail } = await import('@/utils/email');
                    await sendLowStockEmail(user.email, item.name, newStock);
                } catch (emailErr) {
                    console.error("Failed to trigger stock alert:", emailErr);
                }
            }
        }
    }

    // Sanitize customer phone for consistency
    const cleanCustomerPhone = customerPhone?.replace(/\D/g, '')

    // Check if customer has an account globally
    const { data: customerProfile } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('phone', cleanCustomerPhone)
        .single()

    // Enrich customer data with profile info if available
    const finalCustomerName = customerName || customerProfile?.full_name || null
    const finalCustomerEmail = customerEmail || customerProfile?.email || null

    // Update Customer Record
    if (cleanCustomerPhone) {
        const totalOrderValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        // Check if customer exists
        const { data: existingCustomer } = await supabase
            .from('pos_customers')
            .select('total_spend, id')
            .eq('retailer_id', user.id)
            .eq('phone_number', cleanCustomerPhone)
            .single()

        if (existingCustomer) {
            await supabase
                .from('pos_customers')
                .update({
                    total_spend: (existingCustomer.total_spend || 0) + totalOrderValue,
                    last_purchase_date: new Date().toISOString(),
                    // Update name/email if provided OR if we found a profile match
                    ...(finalCustomerName ? { name: finalCustomerName } : {}),
                    ...(finalCustomerEmail ? { email: finalCustomerEmail } : {})
                })
                .eq('id', existingCustomer.id)
        } else {
            await supabase
                .from('pos_customers')
                .insert({
                    retailer_id: user.id,
                    phone_number: cleanCustomerPhone,
                    name: finalCustomerName,
                    email: finalCustomerEmail,
                    total_spend: totalOrderValue,
                    last_purchase_date: new Date().toISOString()
                })
        }

        // Check if customer has an account
        // We already fetched customerProfile above

        // Always record transaction, even if customer doesn't have an App account yet.
        // This allows them to see history when they eventually sign up.

        const { data: transactionData, error: transactionError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id, // This is the Retailer ID
                customer_phone: cleanCustomerPhone,
                items: items,
                subtotal: totalOrderValue,
                tax: 0,
                total: totalOrderValue,
                payment_method: paymentMethod
            })
            .select()
            .single()

        if (transactionError) {
            console.error('Transaction Record Error:', transactionError)
            // We don't stop the process here, but we log it. 
            // Ideally we should have a transaction block for all these updates.
            errors.push(`Failed to record transaction: ${transactionError.message}`)
        } else if (transactionData) {
            // FRAUD DETECTION
            try {
                // reconstruct items with original price
                const contextItems = items.map(item => {
                    // We need to fetch the original product details again or use what we fetched earlier?
                    // We fetched iteratively earlier but didn't store all of them in a map. 
                    // To avoid re-fetching, we can assume we only check basic rules or we should have stored them.
                    // For now, let's just use the item.price as sold price. 
                    // Ideally we should have the MAP of original prices.
                    // Let's rely on the fraud engine to just take what we have. 
                    // But wait, the engine needs original_price for discount check.
                    // The loop above fetches product one by one. I can't easily access them here unless I stored them.
                    // I will skip the "Discount vs Original" check for now in this integration 
                    // OR I can re-fetch or refactor the loop to store product details.
                    // Refactoring is better.
                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        original_price: originalPrices[item.id] || item.price // Use original from DB if available
                    }
                })

                // BETTER APPROACH: Run detection INSIDE the loop? No, signals are aggregate.
                // Let's just pass what we have. item.price is what they paid.
                // The engine will check high-level patterns.

                const fraudContext: TransactionContext = {
                    items: contextItems,
                    total_amount: totalOrderValue,
                    payment_method: paymentMethod,
                    customer_phone: cleanCustomerPhone,
                    timestamp: new Date()
                }

                const engine = new FraudDetectionEngine(fraudContext)
                const signals = engine.analyze()

                if (signals.length > 0) {
                    const alertsToInsert = signals.map(signal => ({
                        retailer_id: user.id,
                        transaction_id: transactionData.transaction_id,
                        severity: signal.severity,
                        alert_type: signal.type,
                        description: signal.description,
                        details: signal.details || {}
                    }))

                    const { error: alertError } = await supabase
                        .from('fraud_alerts')
                        .insert(alertsToInsert)

                    if (alertError) {
                        console.error('Failed to save fraud alerts:', alertError)
                    }
                }

            } catch (err) {
                console.error('Fraud detection error:', err)
            }
        }
    }

    if (errors.length > 0) {
        return { error: `Order processed with issues: ${errors.join(', ')}` }
    }

    revalidatePath('/')
    return { success: true, message: 'Order processed successfully!' }
}

export async function updateCustomer(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone_number = formData.get('phone_number') as string

    const { error } = await supabase
        .from('pos_customers')
        .update({ name, email, phone_number })
        .eq('id', id)
        .eq('retailer_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/')
    return { success: true, message: 'Customer updated successfully' }
}

export async function createRazorpayOrder(amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Check if keys are available
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn("Razorpay keys are missing in environment variables.")
        return { error: 'Payment gateway configuration missing. Please explicitly set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' }
    }

    try {
        const instance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        };

        const order = await instance.orders.create(options);
        return { order };
    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        return { error: error.message || 'Failed to create payment order.' };
    }
}

export async function applyDynamicPrice(productId: string, newPrice: number) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'You must be logged in to update prices.' }
    }

    const { error } = await supabase
        .from('products')
        .update({
            price: newPrice,
            suggested_price: null,
            pricing_reason: null
        })
        .eq('id', productId)
        .eq('retailer_id', user.id)

    if (error) {
        console.error('Update Price Error:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true, message: 'Price updated successfully!' }
}

export async function bulkApplyDynamicPrices(updates: { id: string, price: number }[]) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'You must be logged in to update prices.' }
    }

    // Process updates in a way that respects retailer_id
    // Supabase doesn't easily support bulk update with different values for different rows in one call via the JS client
    // without a custom RPC or running multiple queries.
    // For simplicity and safety within RLS, we'll run individual updates.

    const errors: string[] = []
    for (const update of updates) {
        const { error } = await supabase
            .from('products')
            .update({
                price: update.price,
                suggested_price: null,
                pricing_reason: null
            })
            .eq('id', update.id)
            .eq('retailer_id', user.id)

        if (error) errors.push(`${update.id}: ${error.message}`)
    }

    if (errors.length > 0) {
        return { error: `Completed with errors: ${errors.join(', ')}` }
    }

    revalidatePath('/')
    return { success: true, message: `Successfully updated ${updates.length} prices.` }
}
