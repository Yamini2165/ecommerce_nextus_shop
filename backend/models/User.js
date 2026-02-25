/**
 * models/User.js - User Schema
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt
  }
);

// ── Pre-save Middleware: Hash password before saving ──────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next();

  // Skip hashing if already a bcrypt hash
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Method: Compare entered password with hashed password ─────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
