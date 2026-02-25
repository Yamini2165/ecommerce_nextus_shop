/**
 * controllers/productController.js - Product CRUD & Search Logic
 */

import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

/**
 * @desc    Get all products with search, filter, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  // Build query object
  const query = {};

  // Search by keyword (text search)
  if (req.query.keyword) {
    query.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
      { brand: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  // Filter by category
  if (req.query.category && req.query.category !== 'all') {
    query.category = req.query.category;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Filter by stock availability
  if (req.query.inStock === 'true') {
    query.countInStock = { $gt: 0 };
  }

  const count = await Product.countDocuments(query);

  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (req.query.sort === 'price_asc') sortOption = { price: 1 };
  if (req.query.sort === 'price_desc') sortOption = { price: -1 };
  if (req.query.sort === 'rating') sortOption = { rating: -1 };
  if (req.query.sort === 'newest') sortOption = { createdAt: -1 };

  const products = await Product.find(query)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    data: products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json({ success: true, data: products });
});

/**
 * @desc    Create a product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, image, description, brand,
    category, price, countInStock, isFeatured
  } = req.body;

  const product = await Product.create({
    name,
    image,
    description,
    brand,
    category,
    price,
    countInStock,
    isFeatured: isFeatured || false,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: product });
});

/**
 * @desc    Update a product (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name, image, description, brand,
    category, price, countInStock, isFeatured
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update only provided fields
  product.name = name ?? product.name;
  product.image = image ?? product.image;
  product.description = description ?? product.description;
  product.brand = brand ?? product.brand;
  product.category = category ?? product.category;
  product.price = price ?? product.price;
  product.countInStock = countInStock ?? product.countInStock;
  product.isFeatured = isFeatured ?? product.isFeatured;

  const updatedProduct = await product.save();
  res.json({ success: true, data: updatedProduct });
});

/**
 * @desc    Delete a product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

/**
 * @desc    Create a product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide a rating and comment');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added successfully' });
});

/**
 * @desc    Get all product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json({ success: true, data: categories });
});
