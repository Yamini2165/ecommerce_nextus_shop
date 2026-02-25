/**
 * redux/slices/cartSlice.js - Shopping Cart State
 * Cart items are persisted to localStorage for session continuity
 */

import { createSlice } from '@reduxjs/toolkit';

// Helpers
const roundPrice = (num) => Math.round(num * 100) / 100;

const calcPrices = (items) => {
  const itemsPrice = roundPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99; // Free shipping over $100
  const taxPrice = roundPrice(itemsPrice * 0.1); // 10% tax
  const totalPrice = roundPrice(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

// Load persisted cart from localStorage
const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const persistCart = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    cartItems: state.cartItems,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
  }));
};

// ── Slice ──────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...cartFromStorage,
    ...calcPrices(cartFromStorage.cartItems),
  },
  reducers: {
    /**
     * Add item to cart or update quantity if already exists
     */
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        // Update quantity (cap at available stock)
        state.cartItems = state.cartItems.map((x) =>
          x._id === item._id
            ? { ...x, qty: Math.min(x.qty + item.qty, x.countInStock) }
            : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      persistCart(state);
    },

    /**
     * Remove item from cart by product ID
     */
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      persistCart(state);
    },

    /**
     * Update quantity of an item in cart
     */
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x._id === id ? { ...x, qty } : x
      );
      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      persistCart(state);
    },

    /**
     * Save shipping address to state and localStorage
     */
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      persistCart(state);
    },

    /**
     * Save payment method selection
     */
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      persistCart(state);
    },

    /**
     * Clear cart after successful order
     */
    clearCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQty,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
