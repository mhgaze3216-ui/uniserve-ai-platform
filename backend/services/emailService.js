const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const config = require('../config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }

  async sendWelcomeEmail(userEmail, userName) {
    const template = this.getEmailTemplate('welcome', { userName });
    
    const mailOptions = {
      from: config.email.from,
      to: userEmail,
      subject: 'Welcome to UniServe AI!',
      html: template
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderConfirmation(userEmail, orderDetails) {
    const template = this.getEmailTemplate('order-confirmation', orderDetails);
    
    const mailOptions = {
      from: config.email.from,
      to: userEmail,
      subject: 'Order Confirmation - UniServe AI',
      html: template
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(userEmail, resetToken) {
    const template = this.getEmailTemplate('password-reset', { resetToken });
    
    const mailOptions = {
      from: config.email.from,
      to: userEmail,
      subject: 'Password Reset - UniServe AI',
      html: template
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderStatusUpdate(userEmail, orderStatus, orderId) {
    const template = this.getEmailTemplate('order-status', { orderStatus, orderId });
    
    const mailOptions = {
      from: config.email.from,
      to: userEmail,
      subject: `Order Status Update - ${orderStatus}`,
      html: template
    };

    await this.transporter.sendMail(mailOptions);
  }

  getEmailTemplate(type, data) {
    const templates = {
      welcome: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to UniServe AI</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .content { text-align: center; }
            .btn { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">UniServe<span style="color: #10b981;">AI</span></div>
            </div>
            <div class="content">
              <h2>Welcome, ${data.userName}!</h2>
              <p>Thank you for joining UniServe AI! We're excited to have you on board.</p>
              <p>Explore our marketplace, get consultation services, and enjoy our educational resources.</p>
              <a href="http://localhost:3000" class="btn">Get Started</a>
            </div>
            <div class="footer">
              <p>&copy; 2024 UniServe AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      'order-confirmation': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .order-details { margin: 20px 0; }
            .order-item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; margin: 20px 0; }
            .btn { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">UniServe<span style="color: #10b981;">AI</span></div>
            </div>
            <h2>Order Confirmation</h2>
            <p>Thank you for your order! Here are the details:</p>
            <div class="order-details">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Status:</strong> ${data.status}</p>
              <div class="order-items">
                ${data.orderItems.map(item => `
                  <div class="order-item">
                    <p>${item.name} - ${item.quantity} x $${item.price}</p>
                  </div>
                `).join('')}
              </div>
              <div class="total">
                <p>Total: $${data.totalPrice}</p>
              </div>
            </div>
            <a href="http://localhost:3000/my-orders" class="btn">View Order</a>
            <div class="footer">
              <p>&copy; 2024 UniServe AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      'password-reset': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .btn { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">UniServe<span style="color: #10b981;">AI</span></div>
            </div>
            <h2>Password Reset</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="http://localhost:3000/reset-password?token=${data.resetToken}" class="btn">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
              <p>&copy; 2024 UniServe AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      'order-status': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .status { font-size: 18px; font-weight: bold; color: #10b981; margin: 20px 0; }
            .btn { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">UniServe<span style="color: #10b981;">AI</span></div>
            </div>
            <h2>Order Status Update</h2>
            <p>Your order status has been updated:</p>
            <div class="status">
              <p>Order #${data.orderId}</p>
              <p>Status: ${data.orderStatus}</p>
            </div>
            <a href="http://localhost:3000/my-orders" class="btn">View Order</a>
            <div class="footer">
              <p>&copy; 2024 UniServe AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return templates[type] || templates.welcome;
  }
}

module.exports = new EmailService();
