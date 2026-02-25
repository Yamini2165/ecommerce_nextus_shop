/**
 * pages/ShippingPage.js - Checkout Step 2: Shipping Address
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { CheckoutSteps } from '../components/UI';

const ShippingPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="page-container max-w-lg mx-auto">
      <CheckoutSteps step={2} />
      <h1 className="section-title mb-8 text-center">Shipping Address</h1>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="10001"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3.5 text-base mt-2">
            Continue to Payment →
          </button>
        </form>
      </div>
    </div>
  );
};

export { ShippingPage };
export default ShippingPage;
