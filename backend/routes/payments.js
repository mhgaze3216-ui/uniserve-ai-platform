const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const Order = require('../models/Order');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount } = req.body;

    // Verify order belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const paymentIntent = await paymentService.createPaymentIntent({
      orderId: order._id,
      userId: req.user.id,
      totalPrice: amount
    });

    res.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create checkout session
router.post('/create-checkout-session', auth, [
  body('orderItems').isArray({ min: 1 }).withMessage('Order items are required'),
  body('orderItems.*.name').notEmpty().withMessage('Product name is required'),
  body('orderItems.*.price').isNumeric().withMessage('Price must be a number'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderItems } = req.body;

    // Calculate total
    const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const session = await paymentService.createCheckoutSession({
      orderId: new Date().getTime().toString(), // Temporary ID
      userId: req.user.id,
      orderItems,
      totalPrice
    });

    res.json({
      sessionId: session.sessionId,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId } = req.body;

    const payment = await paymentService.confirmPayment(paymentIntentId);

    // Update order status
    if (payment.status === 'succeeded') {
      const orderId = payment.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, {
        status: 'processing',
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: paymentIntentId,
          status: payment.status,
          update_time: new Date().toISOString()
        }
      });
    }

    res.json({
      status: payment.status,
      amount: payment.amount / 100, // Convert back to dollars
      currency: payment.currency
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Retrieve checkout session
router.get('/checkout-session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await paymentService.retrieveCheckoutSession(sessionId);

    res.json({
      session
    });
  } catch (error) {
    console.error('Retrieve checkout session error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create refund
router.post('/refund', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, amount } = req.body;

    // Only admin can create refunds
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const refund = await paymentService.createRefund(paymentIntentId, amount);

    res.json({
      refund
    });
  } catch (error) {
    console.error('Create refund error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get payment methods
router.get('/payment-methods', auth, async (req, res) => {
  try {
    const paymentMethods = await paymentService.getPaymentMethods();

    res.json({
      paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/create-customer', auth, [
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentMethod } = req.body;

    const customer = await paymentService.createCustomer(req.user.email, paymentMethod);

    res.json({
      customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await paymentService.webhookHandler(req.body, req.headers['stripe-signature']);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order status
        if (paymentIntent.metadata.orderId) {
          await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
            status: 'processing',
            isPaid: true,
            paidAt: new Date(),
            paymentResult: {
              id: paymentIntent.id,
              status: 'succeeded',
              update_time: new Date().toISOString()
            }
          });
        }
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;

      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create subscription
router.post('/create-subscription', auth, [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('priceId').notEmpty().withMessage('Price ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerId, priceId } = req.body;

    const subscription = await paymentService.createSubscription(customerId, priceId);

    res.json({
      subscriptionId: subscription.subscriptionId,
      clientSecret: subscription.clientSecret
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, [
  body('subscriptionId').notEmpty().withMessage('Subscription ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subscriptionId } = req.body;

    // Only admin can cancel subscriptions
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const subscription = await paymentService.cancelSubscription(subscriptionId);

    res.json({
      subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
