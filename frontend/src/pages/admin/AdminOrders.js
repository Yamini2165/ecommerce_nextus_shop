/**
 * pages/admin/AdminOrders.js - Admin Order Management
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Loader, Message } from '../../components/UI';
import { FiEye, FiTruck, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders?page=${page}&limit=15`);
      setOrders(data.data);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleMarkDelivered = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/deliver`);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, isDelivered: true, status: 'Delivered' } : o)
      );
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status } : o)
      );
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors = {
    Pending: 'badge-warning',
    Processing: 'badge-info',
    Shipped: 'badge-info',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Orders</h1>
          <p className="text-slate-500 mt-1">Manage and track all customer orders</p>
        </div>
      </div>

      {error && <Message type="error" className="mb-4">{error}</Message>}

      {loading ? (
        <Loader text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-slate-500">Customer orders will appear here</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/10">
                    <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Order ID</th>
                    <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium hidden sm:table-cell">Customer</th>
                    <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium">Total</th>
                    <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium hidden sm:table-cell">Payment</th>
                    <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium">Status</th>
                    <th className="text-right px-6 py-4 text-slate-400 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-purple-500/5 hover:bg-dark-800 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-purple-400 text-xs">{order._id.slice(-10)}</span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div>
                          <p className="text-white text-sm font-medium">{order.user?.name || 'Unknown'}</p>
                          <p className="text-slate-500 text-xs">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-slate-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 font-bold text-white">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        {order.isPaid ? (
                          <span className="badge-success">Paid</span>
                        ) : (
                          <span className="badge-danger">Unpaid</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className="bg-dark-700 border border-purple-500/20 rounded-lg px-2 py-1 text-sm
                                     text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/order/${order._id}`}
                            className="p-2 rounded-lg bg-dark-600 text-slate-400 hover:text-white hover:bg-dark-500 transition-colors"
                            title="View Order"
                          >
                            <FiEye className="text-sm" />
                          </Link>

                          {!order.isDelivered && (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              disabled={updatingId === order._id}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                              title="Mark as Delivered"
                            >
                              <FiTruck className="text-sm" />
                            </button>
                          )}

                          {order.isDelivered && (
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400" title="Delivered">
                              <FiCheck className="text-sm" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary !py-2 !px-4 disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="flex items-center px-4 text-slate-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary !py-2 !px-4 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
