/**
 * pages/CartPage.js - Shopping Cart with item management
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartQty } from '../redux/slices/cartSlice';
import { FiTrash2, FiArrowRight, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';
import { CheckoutSteps } from '../components/UI';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  const handleQtyChange = (id, qty) => {
    dispatch(updateCartQty({ id, qty }));
  };

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="font-display text-3xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything yet</p>
        <Link to="/" className="btn-primary flex items-center gap-2">
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <CheckoutSteps step={1} />

      <h1 className="section-title mb-8">
        Shopping Cart <span className="text-slate-500 text-2xl font-normal">({cartItems.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4">
              {/* Image */}
              <Link to={`/product/${item._id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; }}
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item._id}`}>
                  <h3 className="font-display font-semibold text-white hover:text-purple-300 transition-colors truncate">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-purple-400 font-bold text-lg mt-1">${item.price.toFixed(2)}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item._id, Math.max(1, item.qty - 1))}
                      className="w-7 h-7 rounded-lg bg-dark-600 border border-purple-500/20 text-white
                                 flex items-center justify-center hover:border-purple-500/50 transition-colors"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="font-bold text-white w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item._id, Math.min(item.countInStock, item.qty + 1))}
                      className="w-7 h-7 rounded-lg bg-dark-600 border border-purple-500/20 text-white
                                 flex items-center justify-center hover:border-purple-500/50 transition-colors"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white">${(item.price * item.qty).toFixed(2)}</span>
                    <button
                      onClick={() => handleRemove(item._id, item.name)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
              ← Continue Shopping
            </Link>
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
                <span className="text-slate-400">Tax (10%)</span>
                <span className="text-white">${taxPrice.toFixed(2)}</span>
              </div>

              {shippingPrice > 0 && (
                <p className="text-xs text-slate-500 bg-dark-800 rounded-lg p-2">
                  Add ${(100 - itemsPrice).toFixed(2)} more for free shipping
                </p>
              )}

              <div className="border-t border-purple-500/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-white">Total</span>
                  <span className="font-display font-bold text-xl text-gradient">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base"
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            {!userInfo && (
              <p className="text-slate-500 text-xs text-center mt-3">
                You'll be asked to sign in to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
