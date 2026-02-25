/**
 * seeder.js - Populate database with sample data
 * Run: node seeder.js (import) | node seeder.js -d (destroy)
 */

import dotenv from 'dotenv';
import colors from 'colors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@shop.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

const sampleProducts = (adminId) => [
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500',
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with dynamic head tracking.',
    brand: 'Apple',
    category: 'Electronics',
    price: 249.99,
    countInStock: 50,
    rating: 4.8,
    numReviews: 156,
    isFeatured: true,
    user: adminId,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    description: 'Industry-leading noise canceling with 8 microphones, exceptional call quality, and 30-hour battery life.',
    brand: 'Sony',
    category: 'Electronics',
    price: 349.99,
    countInStock: 30,
    rating: 4.9,
    numReviews: 89,
    isFeatured: true,
    user: adminId,
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    description: 'Apple M3 Pro chip, 18GB unified memory, 1TB SSD, stunning Liquid Retina XDR display.',
    brand: 'Apple',
    category: 'Electronics',
    price: 1999.99,
    countInStock: 15,
    rating: 4.9,
    numReviews: 43,
    isFeatured: true,
    user: adminId,
  },
  {
    name: 'Nike Air Max 270',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    description: 'Lifestyle sneaker with the largest Max Air unit ever, delivering all-day comfort and bold style.',
    brand: 'Nike',
    category: 'Clothing',
    price: 149.99,
    countInStock: 75,
    rating: 4.6,
    numReviews: 201,
    isFeatured: true,
    user: adminId,
  },
  {
    name: 'The Pragmatic Programmer',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    description: 'Your journey to mastery. 20th Anniversary Edition with new content on agile development, concurrency, and more.',
    brand: 'Addison-Wesley',
    category: 'Books',
    price: 49.99,
    countInStock: 100,
    rating: 4.8,
    numReviews: 378,
    user: adminId,
  },
  {
    name: 'Dyson V15 Detect Absolute',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    description: 'Laser detects microscopic dust, automatically adapts suction, LCD screen shows what has been captured.',
    brand: 'Dyson',
    category: 'Home & Garden',
    price: 749.99,
    countInStock: 20,
    rating: 4.7,
    numReviews: 67,
    user: adminId,
  },
  {
    name: 'Garmin Forerunner 965',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    description: 'Premium GPS running and triathlon smartwatch with AMOLED display, heart rate monitoring, and training analytics.',
    brand: 'Garmin',
    category: 'Sports',
    price: 599.99,
    countInStock: 25,
    rating: 4.8,
    numReviews: 92,
    isFeatured: true,
    user: adminId,
  },
  {
    name: 'LEGO Technic Bugatti Chiron',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
    description: '3,599 pieces. Features a W16 engine with moving pistons, 8-speed gearbox, and all-wheel-drive.',
    brand: 'LEGO',
    category: 'Toys',
    price: 349.99,
    countInStock: 18,
    rating: 4.9,
    numReviews: 134,
    user: adminId,
  },
];

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Let the User model's pre-save hook handle hashing
    const createdUsers = await User.create(users);
    
    const adminUser = createdUsers.find((u) => u.isAdmin);

    await Product.create(sampleProducts(adminUser._id));

    console.log('✅ Sample data imported successfully!'.green.bold);
    console.log('\nAdmin credentials:'.cyan);
    console.log('  Email: admin@shop.com'.cyan);
    console.log('  Password: admin123'.cyan);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ All data destroyed!'.red.bold);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
