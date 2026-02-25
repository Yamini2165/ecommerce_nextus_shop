/**
 * pages/PlaceOrderPage.js - Checkout Step 4: Review & Place Order
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import api from '../utils/api';
import { CheckoutSteps, Message } from '../components/UI';
import { FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  // Redirect if cart is empty or checkout steps skipped
  if (!shippingAddress.address) { navigate('/shipping'); return null; }
  if (!paymentMethod) { navigate('/payment'); return null; }
  if (cartItems.length === 0) { navigate('/cart'); return null; }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post('/orders', {
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

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <CheckoutSteps step={4} />
      <h1 className="section-title mb-8">Review Your Order</h1>

      {error && <Message type="error" className="mb-6">{error}</Message>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Shipping */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiMapPin className="text-purple-400 text-lg" />
              <h3 className="font-display font-semibold text-white">Shipping Address</h3>
            </div>
            <p className="text-slate-400">
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <Link to="/shipping" className="text-purple-400 text-sm hover:underline mt-2 inline-block">
              Edit
            </Link>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiCreditCard className="text-purple-400 text-lg" />
              <h3 className="font-display font-semibold text-white">Payment Method</h3>
            </div>
            <p className="text-slate-400">{paymentMethod}</p>
            <Link to="/payment" className="text-purple-400 text-sm hover:underline mt-2 inline-block">Edit</Link>
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiPackage className="text-purple-400 text-lg" />
              <h3 className="font-display font-semibold text-white">Order Items</h3>
            </div>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=P'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`} className="font-medium text-white hover:text-purple-300 text-sm truncate block">
                      {item.name}
                    </Link>
                    <p className="text-slate-500 text-sm">{item.qty} × ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-white">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-display font-bold text-white text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className={shippingPrice === 0 ? 'text-emerald-400' : 'text-white'}>
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax</span>
                <span className="text-white">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-purple-500/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-white">Total</span>
                  <span className="font-display font-bold text-xl text-gradient">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : '🎉 Place Order'}
            </button>

            <p className="text-slate-500 text-xs text-center mt-3">
              By placing your order you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
