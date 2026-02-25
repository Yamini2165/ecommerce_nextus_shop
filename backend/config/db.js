/**
 * config/db.js - MongoDB Connection with Auto-Seeding
 */

import mongoose from 'mongoose';
import colors from 'colors';
import Product from '../models/Product.js'; // Import the Product model [cite: 27, 28]

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    // --- AUTO-SEED LOGIC ---
    // Check if products already exist in the database
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('No products found. Seeding database...'.yellow);

      const sampleProducts = [
        {
          name: 'Airpods Wireless Bluetooth Headphones',
          image: '/images/airpods.jpg',
          description: 'Bluetooth technology lets you connect it with compatible devices wirelessly',
          brand: 'Apple',
          category: 'Electronics',
          price: 89.99,
          countInStock: 10,
          rating: 4.5,
          numReviews: 12,
        },
        {
          name: 'iPhone 11 Pro 256GB Memory',
          image: '/images/phone.jpg',
          description: 'Introducing the iPhone 11 Pro. A transformative triple-camera system',
          brand: 'Apple',
          category: 'Electronics',
          price: 599.99,
          countInStock: 7,
          rating: 4.0,
          numReviews: 8,
        },
        {
          name: 'Sony Playstation 4 Pro White Version',
          image: '/images/playstation.jpg',
          description: 'The ultimate home entertainment center starts with PlayStation',
          brand: 'Sony',
          category: 'Electronics',
          price: 399.99,
          countInStock: 5,
          rating: 5.0,
          numReviews: 12,
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('✅ Database Auto-Seeded Successfully!'.green.inverse);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;