/**
 * pages/PlaceOrderPage.js - Review Order & Complete Checkout
 * Features: Success Animation, Cart Clearing, and My Orders Redirect.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import api from '../utils/api';
import { CheckoutSteps, Message } from '../components/UI';
import { FiMapPin, FiCreditCard, FiPackage, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFinished, setIsFinished] = useState(false); // Prevents redirect loops
  const [showAnimation, setShowAnimation] = useState(false); // Success Animation trigger

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  // ── Redirect Guards ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isFinished) {
      if (!shippingAddress.address) {
        navigate('/shipping');
      } else if (!paymentMethod) {
        navigate('/payment');
      } else if (cartItems.length === 0) {
        navigate('/cart');
      }
    }
  }, [navigate, shippingAddress, paymentMethod, cartItems, isFinished]);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/orders', {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // 1. Trigger Success UI
      setIsFinished(true); 
      setShowAnimation(true);
      
      // 2. Clear Redux state and LocalStorage
      dispatch(clearCart());
      
      // 3. Short delay to show the animation before redirecting
      setTimeout(() => {
        navigate('/my-orders');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  // ── Success Animation Component ──
  if (showAnimation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm">
        <div className="text-center animate-bounce">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <FiCheckCircle className="text-white text-6xl" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-slate-400">Taking you to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <CheckoutSteps step={4} />
      <h1 className="section-title mb-8 text-white">Review Your Order</h1>

      {error && <Message type="error" className="mb-6">{error}</Message>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6 bg-dark-800 border border-slate-700">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <FiMapPin className="text-purple-400" /> Shipping Address
            </h3>
            <p className="text-slate-400">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="card p-6 bg-dark-800 border border-slate-700">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <FiCreditCard className="text-purple-400" /> Payment Method
            </h3>
            <p className="text-slate-400">{paymentMethod}</p>
          </div>

          <div className="card p-6 bg-dark-800 border border-slate-700">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiPackage className="text-purple-400" /> Items Review
            </h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center border-b border-slate-700/50 pb-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-slate-500 text-xs">{item.qty} x ${item.price}</p>
                    </div>
                  </div>
                  <span className="text-white font-bold">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 bg-dark-800 border border-purple-500/20 sticky top-20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><span className="text-white">${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-slate-400"><span>Shipping</span><span className="text-white">${shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-slate-400"><span>Tax</span><span className="text-white">${taxPrice.toFixed(2)}</span></div>
              <div className="border-t border-slate-700 pt-3 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-purple-400">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-purple-500/20 transition-transform active:scale-95"
            >
              {loading ? 'Processing...' : '🚀 Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;