const config = require('../config');
const stripe = require('stripe')(config.stripeSecret || '');

class PaymentService {
  async createPaymentIntent(orderData) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(orderData.totalPrice * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: orderData.orderId,
          userId: orderData.userId
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Payment Intent creation failed: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  async createCheckoutSession(orderData) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: orderData.orderItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image]
            },
            unit_amount: Math.round(item.price * 100)
          },
          quantity: item.quantity
        })),
        mode: 'payment',
        success_url: `${config.frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.frontendUrl}/order-cancelled`,
        metadata: {
          orderId: orderData.orderId,
          userId: orderData.userId
        }
      });

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      throw new Error(`Checkout session creation failed: ${error.message}`);
    }
  }

  async retrieveCheckoutSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      throw new Error(`Session retrieval failed: ${error.message}`);
    }
  }

  async createRefund(paymentIntentId, amount) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined
      });

      return refund;
    } catch (error) {
      throw new Error(`Refund creation failed: ${error.message}`);
    }
  }

  async getPaymentMethods() {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        limit: 10,
        type: 'card'
      });

      return paymentMethods.data;
    } catch (error) {
      throw new Error(`Payment methods retrieval failed: ${error.message}`);
    }
  }

  async createCustomer(email, paymentMethod) {
    try {
      const customer = await stripe.customers.create({
        email: email,
        payment_method: paymentMethod,
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      });

      return customer;
    } catch (error) {
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }

  async attachPaymentMethodToCustomer(customerId, paymentMethodId) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: customerId }
      );

      return paymentMethod;
    } catch (error) {
      throw new Error(`Payment method attachment failed: ${error.message}`);
    }
  }

  async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Subscription cancellation failed: ${error.message}`);
    }
  }

  async webhookHandler(rawBody, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripeWebhookSecret
      );

      return event;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();
