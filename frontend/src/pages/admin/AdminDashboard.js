/**
 * pages/admin/AdminDashboard.js - Admin Overview Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Loader, Message } from '../../components/UI';
import { FiPackage, FiShoppingBag, FiDollarSign, FiUsers, FiArrowRight, FiTrendingUp } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
      <FiTrendingUp className="text-emerald-400 text-sm" />
    </div>
    <p className="font-display text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-slate-400 text-sm">{label}</p>
    {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          api.get('/orders/admin/stats'),
          api.get('/products?limit=5&sort=newest'),
          api.get('/orders?limit=5'),
        ]);

        setStats(statsRes.data.data);
        setProducts(productsRes.data.data);
        setRecentOrders(ordersRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColors = {
    Pending: 'badge-warning',
    Processing: 'badge-info',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <div className="page-container"><Message type="error">{error}</Message></div>;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your store's performance</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/create" className="btn-primary flex items-center gap-2">
            + New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={`$${(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            sub="From paid orders"
            color="bg-emerald-500"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Orders"
            value={stats.totalOrders || 0}
            sub={`${stats.pendingOrders || 0} pending`}
            color="bg-purple-500"
          />
          <StatCard
            icon={FiPackage}
            label="Delivered"
            value={stats.deliveredOrders || 0}
            sub="Successfully fulfilled"
            color="bg-blue-500"
          />
          <StatCard
            icon={FiUsers}
            label="Pending"
            value={stats.pendingOrders || 0}
            sub="Awaiting action"
            color="bg-orange-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">Recent Orders</h2>
            <Link to="/admin/orders" className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link to={`/order/${order._id}`} key={order._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-800 transition-colors group">
                  <div>
                    <p className="font-mono text-slate-500 text-xs">{order._id.slice(-8)}</p>
                    <p className="text-white text-sm font-medium group-hover:text-purple-300">
                      {order.user?.name || 'Unknown User'}
                    </p>
                    <p className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${order.totalPrice.toFixed(2)}</p>
                    <span className={`${statusColors[order.status] || 'badge-info'} text-xs`}>{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">Recent Products</h2>
            <Link to="/admin/products" className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
              Manage <FiArrowRight />
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800 transition-colors">
                  <img src={product.image} alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                    <p className="text-slate-500 text-xs">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-white text-sm">${product.price.toFixed(2)}</p>
                    <p className={`text-xs ${product.countInStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
