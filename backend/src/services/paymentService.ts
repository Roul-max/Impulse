import crypto from 'crypto';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { PaymentLog } from '../models/PaymentLog';
import razorpay from '../config/razorpay';
import logger from '../utils/logger';

class PaymentService {
  
  verifySignature(body: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret')
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  }

  async handleWebhook(event: any) {
    const { id: paymentId, order_id: razorpayOrderId, status } = event.payload.payment.entity;
    const eventType = event.event;

    // 1. Idempotency Check
    const existingLog = await PaymentLog.findOne({ paymentId, event: eventType });
    if (existingLog) {
      logger.info(`[Payment] Webhook event ${eventType} for ${paymentId} already processed.`);
      return;
    }

    // 2. Find Order
    const order = await Order.findOne({ 'paymentResult.id': razorpayOrderId }) || 
                  await Payment.findOne({ razorpayOrderId }).then(p => p ? Order.findById(p.order) : null);

    if (!order) {
        // Fallback: try to find payment record
        logger.error(`[Payment] Order not found for Razorpay Order ID: ${razorpayOrderId}`);
        // We log it but can't process
        await this.logEvent(paymentId, null, eventType, 'failed_no_order', event.payload);
        return;
    }

    // 3. Process Event
    if (eventType === 'payment.captured') {
        if (!order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                id: paymentId,
                status: 'captured',
                email_address: event.payload.payment.entity.email
            };
            order.status = 'PROCESSING'; // Move to processing
            await order.save();
            
            // Update Payment Record
            await Payment.findOneAndUpdate(
                { razorpayOrderId },
                { status: 'captured', razorpayPaymentId: paymentId }
            );
        }
    } else if (eventType === 'payment.failed') {
        await Payment.findOneAndUpdate(
            { razorpayOrderId },
            { status: 'failed', razorpayPaymentId: paymentId }
        );
        // Optional: Notify user
    }

    // 4. Log Success
    await this.logEvent(paymentId, order._id.toString(), eventType, 'processed', event.payload);
  }

  private async logEvent(paymentId: string, orderId: string | null, event: string, status: string, payload: any) {
      await PaymentLog.create({
          paymentId,
          orderId,
          event,
          status,
          payload,
          processedAt: new Date()
      });
  }
}

export default new PaymentService();