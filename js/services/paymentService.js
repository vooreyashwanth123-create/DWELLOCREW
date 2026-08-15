/**
 * DwelloCrew 2.0 — Safe Payment Gateway Architecture & Mock Processor
 */

export class PaymentService {
  /**
   * Safe mock payment processor with realistic latency simulation.
   * Clearly communicates test environment processing.
   */
  static async processPayment({ amount, method, cardDetails }) {
    // Simulate 600ms gateway round-trip latency
    await new Promise(resolve => setTimeout(resolve, 600));

    if (amount <= 0) {
      return { success: false, error: 'Invalid payment amount.' };
    }

    const transactionId = `TXN_DWL_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId,
      amount,
      method: method || 'Credit Card',
      status: 'PAID',
      timestamp: new Date().toISOString(),
      gatewayReceipt: `DwelloCrew Secure Escrow Deposit #${transactionId}`
    };
  }
}
