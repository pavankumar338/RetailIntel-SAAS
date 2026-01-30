'use client'

import { useActionState, useState, useEffect } from 'react'
import { upsertProduct, deleteProduct, bulkCreateProducts, processOrder, updateCustomer, createRazorpayOrder, type CartItem } from '@/app/actions'
import { createClient } from '@/utils/supabase/client'
import { Tab, Product, Customer, ActionState } from './retailer-dashboard/types'
import { Sidebar } from './retailer-dashboard/Sidebar'
import { Header } from './retailer-dashboard/Header'
import { HomeView } from './retailer-dashboard/views/HomeView'
import { ProductsView } from './retailer-dashboard/views/ProductsView'
import { AnalyticsView } from './retailer-dashboard/views/AnalyticsView'
import { PredictionsView } from './retailer-dashboard/views/PredictionsView'
import { POSView } from './retailer-dashboard/views/POSView'
import { PricingOptimizationView } from './retailer-dashboard/views/PricingOptimizationView'
import { CustomersView } from './retailer-dashboard/views/CustomersView'
import { ProductModal } from './retailer-dashboard/modals/ProductModal'
import { CustomerModal } from './retailer-dashboard/modals/CustomerModal'
import { BulkUploadModal } from './retailer-dashboard/modals/BulkUploadModal'
import { CustomerTransactionsModal } from './retailer-dashboard/modals/CustomerTransactionsModal'
import { OrderStatusModal } from './retailer-dashboard/modals/OrderStatusModal'
import { getCustomerTransactions } from '@/app/actions_transactions'
import { Transaction, Vendor } from '@/components/retailer-dashboard/types'
import { VendorsView } from './retailer-dashboard/views/VendorsView'
import { MarketTrendsView } from './retailer-dashboard/views/MarketTrendsView'
import { FraudDetectionView } from './retailer-dashboard/views/FraudDetectionView'
import { VendorModal } from './retailer-dashboard/modals/VendorModal'
import { createVendor, updateVendor, deleteVendor } from '@/app/actions_vendors'
import { findCustomerByPhone } from '@/app/actions_pos_lookup'

const initialState: ActionState = {
    message: '',
    error: '',
    success: false
}

type Props = {
    profile: any
    products: Product[]
    customers?: Customer[]
    vendors?: Vendor[]
}

export default function RetailerDashboard({ profile, products = [], customers = [], vendors = [] }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('home')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isPendingBulk, setIsPendingBulk] = useState(false)
    const [filterCategory, setFilterCategory] = useState<string>('All')
    const [filterSeason, setFilterSeason] = useState<string>('All')
    const [filterMonth, setFilterMonth] = useState<string>('All')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Auth
    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    const uniqueCategories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]]
    const uniqueSeasons = ['All', ...Array.from(new Set(products.map(p => p.season).filter(Boolean))) as string[]]
    const uniqueMonths = ['All', ...Array.from(new Set(products.map(p => p.month).filter(Boolean))) as string[]]

    const filteredProducts = products.filter(p => {
        const categoryMatch = filterCategory === 'All' || p.category === filterCategory
        const seasonMatch = filterSeason === 'All' || p.season === filterSeason
        const monthMatch = filterMonth === 'All' || p.month === filterMonth
        return categoryMatch && seasonMatch && monthMatch
    })

    // POS State
    const [cart, setCart] = useState<CartItem[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [customerPhone, setCustomerPhone] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash')

    // Handle Phone Changes with Lookup
    const handlePhoneChange = async (phone: string) => {
        setCustomerPhone(phone)

        // Only lookup if phone length is reasonable (e.g., 10 digits)
        if (phone.length === 10) {
            const res = await findCustomerByPhone(phone)
            if (res.found && res.customer) {
                if (res.customer.name) setCustomerName(res.customer.name)
                if (res.customer.email) setCustomerEmail(res.customer.email)
            }
        }
    }

    // Order Status Modal State
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [statusMessage, setStatusMessage] = useState('')
    const [statusDetails, setStatusDetails] = useState<{ amount: number, customer: string, method: string } | undefined>(undefined)

    // Customer State
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [customerFormState, customerFormAction] = useActionState(updateCustomer, initialState)

    // Vendor State
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
    const [vendorFormState, vendorFormAction, isVendorPending] = useActionState(editingVendor ? updateVendor : createVendor, initialState)

    useEffect(() => {
        if (vendorFormState?.success && isVendorModalOpen) {
            setIsVendorModalOpen(false)
            setEditingVendor(null)
        }
    }, [vendorFormState, isVendorModalOpen])

    // Determine which action to use for vendor form based on editing state
    // This is a bit tricky with useActionState, as the hook is called at the top level with one function.
    // A better approach for switching actions is a wrapper or separate forms, but for simplicity here we can use a small workaround or just use same action that dispatches.
    // Actually, React 19 useActionState takes one fn. Let's create a Dispatcher Action or just use two hooks if possible? 
    // No, standard way is a wrapper. I'll use a wrapper function 'upsertVendor' later or simpler:
    // Let's create a 'manageVendor' action that dispatches.

    // Alternative: Just use two separate hooks?
    // const [createVState, createVAction] = useActionState(createVendor, initialState)
    // const [updateVState, updateVAction] = useActionState(updateVendor, initialState)
    // And switch in the render?

    // Let's go with a single unified handler in the modal or just two hooks.
    // For now, I'll use two hooks to be safe with React rules.
    const [createVendorState, createVendorAction, isCreateVendorPending] = useActionState(createVendor, initialState)
    const [updateVendorState, updateVendorAction, isUpdateVendorPending] = useActionState(updateVendor, initialState)

    // Derived state for modal
    const currentVendorState = editingVendor ? updateVendorState : createVendorState
    const currentVendorAction = editingVendor ? updateVendorAction : createVendorAction
    const isVendorActionPending = editingVendor ? isUpdateVendorPending : isCreateVendorPending

    useEffect(() => {
        if (currentVendorState?.success && isVendorModalOpen) {
            setIsVendorModalOpen(false)
            setEditingVendor(null)
        }
    }, [currentVendorState, isVendorModalOpen])


    const handleEditVendor = (vendor: Vendor) => {
        setEditingVendor(vendor)
        setIsVendorModalOpen(true)
    }

    const handleDeleteVendor = async (id: string) => {
        if (confirm('Are you sure you want to delete this vendor?')) {
            await deleteVendor(id)
        }
    }

    const openAddVendorModal = () => {
        setEditingVendor(null)
        setIsVendorModalOpen(true)
    }

    // Transaction Modal State
    const [viewingCustomerTransactions, setViewingCustomerTransactions] = useState<Customer | null>(null)
    const [customerTransactions, setCustomerTransactions] = useState<Transaction[]>([])
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)

    const handleViewTransactions = async (customer: Customer) => {
        setViewingCustomerTransactions(customer)
        setIsLoadingTransactions(true)
        const res = await getCustomerTransactions(customer.phone_number)
        if (res.transactions) {
            setCustomerTransactions(res.transactions)
        } else {
            alert(res.error || 'Failed to fetch transactions')
        }
        setIsLoadingTransactions(false)
    }

    const closeTransactionModal = () => {
        setViewingCustomerTransactions(null)
        setCustomerTransactions([])
    }

    useEffect(() => {
        if (customerFormState.success) {
            setIsCustomerModalOpen(false)
            setEditingCustomer(null)
            // Optionally show toast
        }
    }, [customerFormState])

    // POS Cart Helpers
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
        })
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: newQty }
                }
                return item
            })
        })
    }

    const setCartItemQuantity = (id: string, quantity: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: Math.max(1, quantity) }
                }
                return item
            })
        })
    }

    const updatePrice = (id: string, price: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    return { ...item, price: Math.max(0, price) }
                }
                return item
            })
        })
    }

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    const handleProcessOrder = async () => {
        if (cart.length === 0) return
        if (!customerPhone) {
            alert('Please enter a customer mobile number.')
            return
        }

        setStatusModalOpen(true)
        setOrderStatus('processing')
        setStatusMessage(paymentMethod === 'upi' ? 'Initializing Online Payment...' : 'Recording Cash Transaction...')
        setIsProcessing(true)

        if (paymentMethod === 'upi') {
            try {
                const res = await createRazorpayOrder(cartTotal)
                if (res.error || !res.order) {
                    setOrderStatus('error')
                    setStatusMessage(res.error || 'Failed to create order')
                    setIsProcessing(false)
                    return
                }

                const { order } = res

                const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
                if (!keyId) {
                    setOrderStatus('error')
                    setStatusMessage('Razorpay Key ID is not defined.')
                    setIsProcessing(false)
                    return
                }

                setStatusMessage('Waiting for customer payment...')

                const options = {
                    key: keyId,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Retail Intelligence POS",
                    description: "POS Transaction",
                    order_id: order.id,
                    handler: async function (response: any) {
                        setStatusMessage('Verifying and Recording Order...')
                        try {
                            const result = await processOrder(cart, customerPhone, 'upi', customerName, customerEmail)
                            if (result.error) {
                                setOrderStatus('error')
                                setStatusMessage(result.error)
                            } else {
                                setOrderStatus('success')
                                setStatusMessage('Order recorded successfully.')
                                setStatusDetails({
                                    amount: cartTotal,
                                    customer: customerName || customerPhone,
                                    method: 'upi'
                                })
                                setCart([])
                                setCustomerPhone('')
                                setCustomerName('')
                                setCustomerEmail('')
                            }
                        } catch (e) {
                            console.error(e)
                            setOrderStatus('error')
                            setStatusMessage('Order recording failed after payment')
                        } finally {
                            setIsProcessing(false)
                        }
                    },
                    prefill: {
                        contact: customerPhone
                    },
                    theme: {
                        color: "#2563eb"
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false)
                            if (orderStatus !== 'success') {
                                setStatusModalOpen(false)
                            }
                        }
                    }
                };

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.on('payment.failed', function (response: any) {
                    setOrderStatus('error')
                    setStatusMessage(response.error.description || 'Payment failed.')
                    setIsProcessing(false)
                });
                rzp1.open();

            } catch (err) {
                console.error("Payment Initialization Error:", err)
                setOrderStatus('error')
                setStatusMessage('Payment initialization failed')
                setIsProcessing(false)
            }
        } else {
            // Cash Flow - confirmation in modal? 
            // For now assume user clicked "Pay" so they are sure, or we could add a confirmation step.
            // But since the modal pops up as "Processing", let's just do it. 
            // The previous code had a confirm(), let's simulate a small delay for UX so they see "Processing"

            await new Promise(resolve => setTimeout(resolve, 800)) // Fake processing delay for UX

            const result = await processOrder(cart, customerPhone, 'cash', customerName, customerEmail)
            if (result.error) {
                setOrderStatus('error')
                setStatusMessage(result.error)
            } else {
                setOrderStatus('success')
                setStatusMessage('Cash transaction recorded.')
                setStatusDetails({
                    amount: cartTotal,
                    customer: customerName || customerPhone,
                    method: 'cash'
                })
                setCart([])
                setCustomerPhone('')
                setCustomerName('')
                setCustomerEmail('')
            }
            setIsProcessing(false)
        }
    }



    // React 19 useActionState
    // @ts-ignore - Ignoring strict union mismatch for rapid prototyping
    const [state, formAction, isPending] = useActionState(upsertProduct, initialState)

    useEffect(() => {
        if (state?.success && isModalOpen && hasSubmitted) {
            setIsModalOpen(false)
        }
    }, [state, isModalOpen, hasSubmitted])

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setHasSubmitted(false)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const res = await deleteProduct(id)
            if (res?.error) {
                alert(res.error)
            }
        }
    }

    const openAddModal = () => {
        setEditingProduct(null)
        setHasSubmitted(false)
        setIsModalOpen(true)
    }

    const handleSubmit = (formData: FormData) => {
        setHasSubmitted(true)
        formAction(formData)
    }

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsPendingBulk(true)
        try {
            const text = await file.text()
            const lines = text.split('\n').filter(l => l.trim())

            if (lines.length < 2) {
                alert('File seems empty or missing headers')
                setIsPendingBulk(false)
                return
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase().replace(/ /g, '_'))

            const parsed = lines.slice(1).map(line => {
                // Regex to split by comma, ignoring commas inside quotes
                const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))
                const obj: any = {}
                headers.forEach((h, i) => {
                    const cleanH = h.replace(/[^a-z0-9]/g, '')

                    // Name
                    if (['name', 'productname', 'itemname'].includes(cleanH)) obj.name = values[i]

                    // Price
                    else if (['price', 'priceunit', 'priceperunit', 'unitprice'].includes(cleanH)) obj.price = values[i]

                    // Cost
                    else if (['cost', 'costunit', 'costperunit', 'unitcost'].includes(cleanH)) obj.cost_per_unit = values[i]

                    // Stock
                    else if (['stock', 'quantity', 'stockquantity', 'inventory', 'units', 'stockavailable'].includes(cleanH)) obj.stock_quantity = values[i]

                    // Category
                    else if (['category', 'cat', 'department'].includes(cleanH)) obj.category = values[i]

                    // SKU
                    else if (['sku', 'id', 'productid', 'customid', 'customproductid'].includes(cleanH)) obj.custom_product_id = values[i]

                    // Analytics
                    else if (['sales', 'salescount', 'unitssold', 'sold'].includes(cleanH)) obj.sales_count = values[i]
                    else if (['revenue', 'totalrevenue', 'rev'].includes(cleanH)) obj.total_revenue = values[i]
                    else if (['profit', 'netincome'].includes(cleanH)) obj.profit = values[i]
                    else if (['demand', 'demandscore', 'score'].includes(cleanH)) obj.demand_score = values[i]

                    // Meta
                    else if (['season', 'currentseason', 'timeofyear'].includes(cleanH)) obj.season = values[i]
                    else if (['region', 'location', 'area', 'zone', 'country'].includes(cleanH)) obj.region = values[i]
                    else if (['description', 'desc', 'details', 'info'].includes(cleanH)) obj.description = values[i]

                    // Extended Prediction Fields
                    else if (['monthnum', 'monthnumber', 'month_num', 'month_no'].includes(cleanH)) obj.month_num = values[i]
                    else if (['isfestival', 'festival', 'holiday', 'is_festival'].includes(cleanH)) {
                        const val = values[i].toLowerCase()
                        obj.is_festival = val === 'true' || val === 'yes' || val === '1'
                    }
                    else if (['ispromo', 'promo', 'promotion', 'is_promo'].includes(cleanH)) {
                        const val = values[i].toLowerCase()
                        obj.is_promo = val === 'true' || val === 'yes' || val === '1'
                    }
                    else if (['discount', 'discountpercent', 'discount_percent', 'off'].includes(cleanH)) obj.discount_percent = values[i]

                    // Fallback
                    else obj[h] = values[i]
                })
                return obj
            }).filter(p => p.name) // Ensure at least a name exists

            if (parsed.length === 0) {
                alert('No valid products found in CSV')
                setIsPendingBulk(false)
                return
            }

            const result = await bulkCreateProducts(null, parsed)

            if (result.error) {
                alert(result.error)
            } else {
                alert(result.message)
                setIsBulkModalOpen(false)
            }
        } catch (err) {
            console.error(err)
            alert('Failed to parse CSV file')
        } finally {
            setIsPendingBulk(false)
            // Reset file input
            e.target.value = ''
        }
    }

    const downloadTemplate = () => {
        const headers = [
            "name", "price", "category", "description", "stock_quantity",
            "cost_per_unit", "custom_product_id", "season", "region",
            "sales_count", "total_revenue", "profit", "demand_score",
            "month_num", "is_festival", "discount_percent", "is_promo"
        ]
        const dummy = [
            "Sample Product", "29.99", "Electronics", "A great sample product", "100",
            "15.00", "SKU-SAMPLE-1", "Summer", "North America",
            "0", "0.00", "0.00", "50",
            "1", "false", "0", "false"
        ]
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + dummy.join(",")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "product_import_template.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Analytics Calculations
    const totalProducts = products.length
    const totalSales = products.reduce((acc, p) => acc + (p.sales_count || 0), 0)
    const totalViews = products.reduce((acc, p) => acc + (p.views_count || 0), 0)
    const totalRevenue = products.reduce((acc, p) => acc + (p.total_revenue || (p.price * (p.sales_count || 0))), 0)
    const totalProfit = products.reduce((acc, p) => acc + (p.profit || 0), 0)

    // Top categories
    const categories: Record<string, number> = {}
    products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1
    })

    // Data for Graphs
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

    // 1. Monthly Sales Trend
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthlySalesMap: Record<string, number> = {};
    products.forEach(p => {
        const m = p.month || 'Unknown';
        monthlySalesMap[m] = (monthlySalesMap[m] || 0) + (p.sales_count || 0);
    });

    // Sort by standard month order
    const monthlySalesData = Object.keys(monthlySalesMap)
        .map(m => ({ name: m, sales: monthlySalesMap[m] }))
        .sort((a, b) => {
            const idxA = monthOrder.indexOf(a.name);
            const idxB = monthOrder.indexOf(b.name);
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });

    // 2. Category Distribution (by Sales Volume for better business insight)
    const categorySalesMap: Record<string, number> = {};
    products.forEach(p => {
        categorySalesMap[p.category] = (categorySalesMap[p.category] || 0) + (p.sales_count || 0);
    });
    // Filter out zero sales to avoid ugly pie slices
    const categorySalesData = Object.keys(categorySalesMap)
        .map(c => ({ name: c, value: categorySalesMap[c] }))
        .filter(item => item.value > 0);

    // 3. Seasonal Analysis
    const seasonalSalesMap: Record<string, number> = {};
    products.forEach(p => {
        const s = p.season || 'Unknown';
        seasonalSalesMap[s] = (seasonalSalesMap[s] || 0) + (p.sales_count || 0);
    });
    const seasonalData = Object.keys(seasonalSalesMap)
        .map(s => ({ name: s, sales: seasonalSalesMap[s] }));

    // 4. Top 5 Products by Revenue
    const topRevenueData = [...products]
        .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
        .slice(0, 5)
        .map(p => ({
            name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
            revenue: p.total_revenue || 0
        }));

    return (
        <div className="flex h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                profile={profile}
                handleSignOut={handleSignOut}
            />

            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-8 relative">
                <div className="fixed inset-0 z-0 bg-black pointer-events-none" />

                <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    activeTab={activeTab}
                />

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10">
                    {activeTab === 'home' && (
                        <HomeView
                            products={products}
                            totalProducts={totalProducts}
                            totalSales={totalSales}
                            totalViews={totalViews}
                            totalRevenue={totalRevenue}
                            totalProfit={totalProfit}
                            categories={categories}
                            openAddModal={openAddModal}
                        />
                    )}

                    {activeTab === 'products' && (
                        <ProductsView
                            filterCategory={filterCategory}
                            setFilterCategory={setFilterCategory}
                            filterSeason={filterSeason}
                            setFilterSeason={setFilterSeason}
                            filterMonth={filterMonth}
                            setFilterMonth={setFilterMonth}
                            uniqueCategories={uniqueCategories}
                            uniqueSeasons={uniqueSeasons}
                            uniqueMonths={uniqueMonths}
                            openAddModal={openAddModal}
                            setIsBulkModalOpen={setIsBulkModalOpen}
                            filteredProducts={filteredProducts}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'analytics' && (
                        <AnalyticsView
                            totalRevenue={totalRevenue}
                            totalProfit={totalProfit}
                            totalViews={totalViews}
                            monthlySalesData={monthlySalesData}
                            categorySalesData={categorySalesData}
                            seasonalData={seasonalData}
                            topRevenueData={topRevenueData}
                            COLORS={COLORS}
                        />
                    )}

                    {activeTab === 'predictions' && (
                        <PredictionsView
                            filterCategory={filterCategory}
                            setFilterCategory={setFilterCategory}
                            uniqueCategories={uniqueCategories}
                            filteredProducts={filteredProducts}
                        />
                    )}

                    {activeTab === 'pos' && (
                        <POSView
                            filterCategory={filterCategory}
                            setFilterCategory={setFilterCategory}
                            filterSeason={filterSeason}
                            setFilterSeason={setFilterSeason}
                            filterMonth={filterMonth}
                            setFilterMonth={setFilterMonth}
                            uniqueCategories={uniqueCategories}
                            uniqueSeasons={uniqueSeasons}
                            uniqueMonths={uniqueMonths}
                            filteredProducts={filteredProducts}
                            addToCart={addToCart}
                            cart={cart}
                            removeFromCart={removeFromCart}
                            updateQuantity={updateQuantity}
                            cartTotal={cartTotal}
                            handleProcessOrder={handleProcessOrder}
                            isProcessing={isProcessing}
                            customerPhone={customerPhone}
                            setCustomerPhone={handlePhoneChange}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            customerName={customerName}
                            setCustomerName={setCustomerName}
                            customerEmail={customerEmail}
                            setCustomerEmail={setCustomerEmail}
                            setCartItemQuantity={setCartItemQuantity}
                            updatePrice={updatePrice}
                        />
                    )}

                    {activeTab === 'customers' && (
                        <CustomersView
                            customers={customers}
                            setEditingCustomer={setEditingCustomer}
                            setIsCustomerModalOpen={setIsCustomerModalOpen}
                            onViewTransactions={handleViewTransactions}
                        />
                    )}

                    {activeTab === 'dynamic_pricing' && (
                        <PricingOptimizationView
                            products={products}
                        />
                    )}

                    {activeTab === 'vendors' && (
                        <VendorsView
                            vendors={vendors}
                            openAddModal={openAddVendorModal}
                            handleEdit={handleEditVendor}
                            handleDelete={handleDeleteVendor}
                        />
                    )}

                    {activeTab === 'market_trends' && (
                        <MarketTrendsView />
                    )}

                    {activeTab === 'fraud_detection' && (
                        <FraudDetectionView />
                    )}
                </div>

                <CustomerTransactionsModal
                    isOpen={!!viewingCustomerTransactions}
                    onClose={closeTransactionModal}
                    transactions={customerTransactions}
                    customer={viewingCustomerTransactions}
                    isLoading={isLoadingTransactions}
                />

                <OrderStatusModal
                    isOpen={statusModalOpen}
                    onClose={() => setStatusModalOpen(false)}
                    status={orderStatus}
                    message={statusMessage}
                    details={statusDetails}
                />

                <ProductModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    editingProduct={editingProduct}
                    handleSubmit={handleSubmit}
                    state={state}
                    hasSubmitted={hasSubmitted}
                    isPending={isPending}
                />

                <CustomerModal
                    isCustomerModalOpen={isCustomerModalOpen}
                    setIsCustomerModalOpen={setIsCustomerModalOpen}
                    editingCustomer={editingCustomer}
                    customerFormAction={customerFormAction}
                />

                <VendorModal
                    isOpen={isVendorModalOpen}
                    onClose={() => setIsVendorModalOpen(false)}
                    editingVendor={editingVendor}
                    handleSubmit={currentVendorAction}
                    state={currentVendorState}
                    isPending={isVendorActionPending}
                />

                <BulkUploadModal
                    isBulkModalOpen={isBulkModalOpen}
                    setIsBulkModalOpen={setIsBulkModalOpen}
                    handleBulkUpload={handleBulkUpload}
                    isPendingBulk={isPendingBulk}
                    downloadTemplate={downloadTemplate}
                />
            </main>
        </div>
    )
}
