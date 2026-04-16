
export interface MockOrder {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
  cashbackAmount: number;
}

export interface ShopifyDiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minimumAmount?: number;
  description: string;
  isEligible?: boolean;
}

class MockApiService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock Shopify Discount Codes (in reality these come from Shopify Admin API)
  private discountCodes: ShopifyDiscountCode[] = [
    { id: 'dc1', code: 'WELCOME10', type: 'percentage', value: 10, description: '10% off your first order' },
    { id: 'dc2', code: 'FREESHIP', type: 'fixed_amount', value: 5.00, minimumAmount: 30, description: '$5 off + Free Shipping' },
    { id: 'dc3', code: 'SUMMER20', type: 'percentage', value: 15, minimumAmount: 50, description: '15% off orders over $50' },
    { id: 'dc4', code: 'BUNDLE5', type: 'fixed_amount', value: 5.00, description: '$5 off any bundle' },
  ];

  // Get ALL discount codes from Shopify (with eligibility info)
  async getAvailableDiscounts(subtotal: number): Promise<ShopifyDiscountCode[]> {
    await this.delay(500);
    return this.discountCodes.map(dc => ({
      ...dc,
      isEligible: !dc.minimumAmount || subtotal >= dc.minimumAmount
    }));
  }

  // Apply multiple discount codes and calculate new total (stackable)
  async applyDiscounts(subtotal: number, tax: number, codes: string[]): Promise<{ totalDiscount: number; breakdown: { code: string; discount: number }[]; newSubtotal: number; newTotal: number }> {
    await this.delay(300);
    let totalDiscount = 0;
    const breakdown: { code: string; discount: number }[] = [];

    for (const code of codes) {
      const discountCode = this.discountCodes.find(dc => dc.code === code);
      if (!discountCode) continue;

      let discount = 0;
      if (discountCode.type === 'percentage') {
        discount = subtotal * (discountCode.value / 100);
      } else {
        discount = discountCode.value;
      }
      totalDiscount += discount;
      breakdown.push({ code, discount });
    }

    const newSubtotal = Math.max(0, subtotal - totalDiscount);
    const newTotal = newSubtotal + tax;
    return { totalDiscount, breakdown, newSubtotal, newTotal };
  }

  // Simulate Shopify Gift Card generation from Balance
  async createGiftCardFromBalance(userId: string, amount: number): Promise<{ code: string; id: string }> {
    await this.delay(800);
    return {
      code: `GIFT-${userId.slice(-4).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      id: `gc_${Math.random().toString(36).substring(7)}`
    };
  }

  // Get user balance
  async getUserBalance(userId: string): Promise<{ total: number; frozen: number; available: number }> {
    await this.delay(400);
    return {
      total: 120.50,
      frozen: 0,
      available: 120.50
    };
  }

  // Simulate Shopify Checkout URL generation
  async createShopifyCheckout(productId: string, variationIndex: number, quantity: number, giftCardCode?: string) {
    await this.delay(1000);
    // In reality, this would call the backend to get a Shopify checkout URL
    // and include the gift card in the cart/checkout session
    const baseUrl = `https://shopify-mock.0buck.com/checkouts/${Math.random().toString(36).substring(7)}`;
    const checkoutUrl = giftCardCode ? `${baseUrl}?gift_card=${giftCardCode}` : baseUrl;
    return {
      checkoutUrl,
      orderId: `ORD-${Math.floor(Math.random() * 1000000)}`
    };
  }

  // Simulate Check-in
  async performCheckIn(userId: string) {
    await this.delay(800);
    return {
      success: true,
      pointsEarned: 50,
      streakDays: 7
    };
  }

  // Simulate Order Payment Status Update (Webhook simulation)
  async verifyPayment(orderId: string) {
    await this.delay(2000);
    return {
      status: 'paid',
      paidAt: new Date().toISOString()
    };
  }
}

export const mockApi = new MockApiService();
