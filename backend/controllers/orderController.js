/**
 * controllers/orderController.js - Order Management Logic
 */

import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Validate stock availability for each item
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.name} not found`);
    }
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Decrement stock for each ordered product
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.qty },
    });
  }

  res.status(201).json({ success: true, data: order });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Users can only view their own orders; admins can view any
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  };

  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

/**
 * @desc    Update order to delivered (Admin)
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'Delivered';

  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.limit) || 20;

  const count = await Order.countDocuments();
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    data: orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

/**
 * @desc    Get order statistics (Admin Dashboard)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const pendingOrders = await Order.countDocuments({ status: 'Pending' });
  const deliveredOrders = await Order.countDocuments({ isDelivered: true });

  // Revenue by month (last 6 months)
  const revenueByMonth = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
      revenueByMonth,
    },
  });
});
