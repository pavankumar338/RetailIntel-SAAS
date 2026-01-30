
export type FraudSignal = {
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: 'skip_scan' | 'discount_abuse' | 'cash_pocketing' | 'time_anomaly' | 'price_override';
    description: string;
    details?: any;
}

export type TransactionContext = {
    items: {
        id: string;
        name: string;
        price: number;
        original_price?: number; // Fetched from DB
        quantity: number;
    }[];
    total_amount: number;
    payment_method: string;
    customer_phone?: string;
    cashier_id?: string;
    timestamp: Date;
}

export class FraudDetectionEngine {
    private signals: FraudSignal[] = [];

    constructor(private context: TransactionContext) { }

    public analyze(): FraudSignal[] {
        this.checkBillAmountVsItems();
        this.checkPaymentMode();
        this.checkTimeBasedBehavior();
        this.checkPriceOverrides();
        return this.signals;
    }

    // 1. Bill Amount vs Number of Items
    // Pattern: 5 items ≈ ₹300. Suspicious: 5 items but only ₹80
    private checkBillAmountVsItems() {
        const itemCount = this.context.items.reduce((sum, item) => sum + item.quantity, 0);
        const avgPricePerItem = this.context.total_amount / (itemCount || 1);

        if (itemCount >= 5 && avgPricePerItem < 20) { // Threshold: < ₹20 per item average for bulk
            this.signals.push({
                severity: 'high',
                type: 'skip_scan',
                description: `Suspiciously low bill amount (₹${this.context.total_amount}) for high item count (${itemCount}). Possible skip-scan.`,
                details: { itemCount, avgPricePerItem }
            });
        }
    }

    // 2. Discount Patterns (Simplified for single transaction)
    // We check if sold price is significantly lower than original price (if available)
    private checkPriceOverrides() {
        this.context.items.forEach(item => {
            if (item.original_price && item.price < item.original_price) {
                const discountPercent = ((item.original_price - item.price) / item.original_price) * 100;

                if (discountPercent > 50) {
                    this.signals.push({
                        severity: 'medium',
                        type: 'discount_abuse',
                        description: `Heavy discount (${discountPercent.toFixed(0)}%) detected on ${item.name}.`,
                        details: { item: item.name, original: item.original_price, sold: item.price }
                    });
                }
            }
        });
    }

    // 3. Payment Mode Ratio
    // Flags High Value Cash Transactions
    private checkPaymentMode() {
        if (this.context.payment_method === 'cash' && this.context.total_amount > 5000) {
            this.signals.push({
                severity: 'medium',
                type: 'cash_pocketing', // Risk of pocketing without recording if not monitored, or just AML risk
                description: `High value cash transaction (₹${this.context.total_amount}). Verify cash collection.`,
            });
        }
    }

    // 4. Time-Based Behavior
    // Detects late night transactions
    private checkTimeBasedBehavior() {
        const hour = this.context.timestamp.getHours();

        // Late night (after 10 PM) or Early morning (before 6 AM)
        if (hour >= 22 || hour < 6) {
            this.signals.push({
                severity: 'low',
                type: 'time_anomaly',
                description: `Transaction recorded outside normal business hours (${this.context.timestamp.toLocaleTimeString()}).`,
            });
        }
    }
}
