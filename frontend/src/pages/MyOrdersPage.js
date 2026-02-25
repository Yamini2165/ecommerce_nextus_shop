/**
 * pages/MyOrdersPage.js - User order history
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Loader, Message } from '../components/UI';
import { FiPackage, FiEye } from 'react-icons/fi';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColors = {
    Pending: 'badge-warning',
    Processing: 'badge-info',
    Shipped: 'badge-info',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">My Orders</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-4">📦</div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">When you place orders, they'll appear here</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-slate-500 text-xs mb-1">#{order._id}</p>
                  <p className="text-white font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <p className="text-slate-400 text-sm">{order.orderItems.length} item(s)</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-display font-bold text-white text-lg">${order.totalPrice.toFixed(2)}</p>
                    <div className="flex gap-2 justify-end mt-1">
                      <span className={statusColors[order.status] || 'badge-info'}>{order.status}</span>
                      {order.isPaid && <span className="badge-success">Paid</span>}
                    </div>
                  </div>

                  <Link
                    to={`/order/${order._id}`}
                    className="flex items-center gap-2 btn-secondary !py-2 !px-4 !text-sm"
                  >
                    <FiEye /> Details
                  </Link>
                </div>
              </div>

              {/* Order items preview */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-purple-500/10 overflow-x-auto">
                {order.orderItems.slice(0, 4).map((item) => (
                  <img
                    key={item._id}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                    title={item.name}
                  />
                ))}
                {order.orderItems.length > 4 && (
                  <div className="w-12 h-12 bg-dark-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-400 text-xs">+{order.orderItems.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
