/**
 * pages/OrderPage.js - Order detail with payment simulation
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Loader, Message } from '../components/UI';
import { FiCheck, FiClock, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  // Simulate payment (demo purposes)
  const handleSimulatePayment = async () => {
    try {
      setPaying(true);
      await api.put(`/orders/${id}/pay`, {
        id: `PAY-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: { email_address: 'buyer@paypal.com' },
      });
      toast.success('Payment successful!');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const statusColors = {
    Pending: 'badge-warning',
    Processing: 'badge-info',
    Shipped: 'badge-info',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };

  if (loading) return <Loader />;
  if (error) return <div className="page-container"><Message type="error">{error}</Message></div>;
  if (!order) return null;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Order Details</h1>
          <p className="text-slate-500 text-sm mt-1 font-mono">#{order._id}</p>
        </div>
        <span className={statusColors[order.status] || 'badge-info'}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {/* Status Timeline */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-white mb-4">Order Status</h3>
            <div className="flex items-center gap-2">
              {[
                { label: 'Ordered', done: true },
                { label: 'Paid', done: order.isPaid },
                { label: 'Processing', done: order.status !== 'Pending' },
                { label: 'Delivered', done: order.isDelivered },
              ].map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.done ? 'bg-emerald-500' : 'bg-dark-700 border border-slate-600'
                    }`}>
                      {step.done ? <FiCheck className="text-white text-sm" /> : <FiClock className="text-slate-500 text-sm" />}
                    </div>
                    <span className={`text-xs ${step.done ? 'text-emerald-400' : 'text-slate-500'}`}>{step.label}</span>
                  </div>
                  {i < 3 && <div className={`flex-1 h-0.5 ${step.done ? 'bg-emerald-500' : 'bg-dark-600'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <FiMapPin className="text-purple-400" />
              <h3 className="font-display font-semibold text-white">Shipping Address</h3>
            </div>
            <p className="text-slate-400 text-sm">
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="badge-success mt-3">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</div>
            ) : (
              <div className="badge-warning mt-3">Not yet delivered</div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <FiCreditCard className="text-purple-400" />
              <h3 className="font-display font-semibold text-white">Payment</h3>
            </div>
            <p className="text-slate-400 text-sm">{order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="badge-success mt-3">Paid on {new Date(order.paidAt).toLocaleDateString()}</div>
            ) : (
              <div className="badge-danger mt-3">Not yet paid</div>
            )}
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiPackage className="text-purple-400" />
              <h3 className="font-display font-semibold text-white">Order Items</h3>
            </div>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="font-medium text-white hover:text-purple-300 text-sm truncate block">
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
                <span className="text-slate-400">Items</span>
                <span className="text-white">${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className={order.shippingPrice === 0 ? 'text-emerald-400' : 'text-white'}>
                  {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax</span>
                <span className="text-white">${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-purple-500/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-white">Total</span>
                  <span className="font-display font-bold text-xl text-gradient">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pay button (demo simulation) */}
            {!order.isPaid && (
              <button
                onClick={handleSimulatePayment}
                disabled={paying}
                className="btn-primary w-full py-3.5 text-base"
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : '💳 Simulate Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
