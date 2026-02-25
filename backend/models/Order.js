/**
 * models/Order.js - Order Schema
 */

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['PayPal', 'Stripe', 'Credit Card', 'Cash on Delivery'],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
