/**
 * redux/slices/cartSlice.js - Shopping Cart State
 * Fixed: Prevents duplicate items and ensures persistence.
 */
import { createSlice } from '@reduxjs/toolkit';

const roundPrice = (num) => Math.round(num * 100) / 100;

// Helper to calculate total summary
const calcPrices = (items) => {
  const itemsPrice = roundPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  const shippingPrice = itemsPrice > 100 ? 0 : 9.99; // Free shipping over $100
  const taxPrice = roundPrice(itemsPrice * 0.1); // 10% tax
  const totalPrice = roundPrice(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

// Initialize state from LocalStorage
const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

// Persistence helper
const persistCart = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    cartItems: state.cartItems,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...cartFromStorage,
    ...calcPrices(cartFromStorage.cartItems),
  },
  reducers: {
    /**
     * Add to cart: Updates quantity if item exists, else adds new
     */
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === item._id
            ? { ...x, qty: Math.min(item.qty, x.countInStock) } 
            : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      persistCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      persistCart(state);
    },

    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x._id === id ? { ...x, qty } : x
      );
      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      persistCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      persistCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      persistCart(state);
    },

    /**
     * Clear cart: Resets all prices and removes LocalStorage data
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
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;