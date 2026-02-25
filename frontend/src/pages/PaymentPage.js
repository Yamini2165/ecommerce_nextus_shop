/**
 * pages/PaymentPage.js - Checkout Step 3: Payment Method
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { CheckoutSteps } from '../components/UI';
import { FiCheck } from 'react-icons/fi';

const PAYMENT_METHODS = [
  { id: 'PayPal', label: 'PayPal', icon: '🅿️', description: 'Pay securely via PayPal' },
  { id: 'Stripe', label: 'Stripe', icon: '💳', description: 'Credit/Debit card via Stripe' },
  { id: 'Credit Card', label: 'Credit Card', icon: '💳', description: 'Direct credit card payment' },
  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: '💵', description: 'Pay when your order arrives' },
];

const PaymentPage = () => {
  const { paymentMethod: savedMethod, shippingAddress } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(savedMethod || 'PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if no shipping address
  if (!shippingAddress.address) {
    navigate('/shipping');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  };

  return (
    <div className="page-container max-w-lg mx-auto">
      <CheckoutSteps step={3} />
      <h1 className="section-title mb-8 text-center">Payment Method</h1>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-purple-500/10 hover:border-purple-500/30 bg-dark-800'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-white">{method.label}</p>
                <p className="text-sm text-slate-500">{method.description}</p>
              </div>
              {paymentMethod === method.id && (
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <FiCheck className="text-white text-xs" />
                </div>
              )}
            </label>
          ))}

          <button type="submit" className="btn-primary w-full py-3.5 text-base mt-4">
            Review Order →
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
