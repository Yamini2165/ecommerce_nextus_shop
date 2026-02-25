/**
 * pages/admin/AdminProducts.js - Admin Product Management
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Loader, Message } from '../../components/UI';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: 50, ...(search && { keyword: search }) });
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success(`${name} deleted successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Products</h1>
          <p className="text-slate-500 mt-1">{products.length} products total</p>
        </div>
        <Link to="/admin/products/create" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-10"
        />
      </div>

      {error && <Message type="error" className="mb-4">{error}</Message>}

      {loading ? (
        <Loader text="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">No products found</h3>
          <Link to="/admin/products/create" className="btn-primary mt-4 inline-block">Add Your First Product</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/10">
                  <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Product</th>
                  <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium">Price</th>
                  <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium hidden md:table-cell">Stock</th>
                  <th className="text-left px-4 py-4 text-slate-400 text-sm font-medium hidden lg:table-cell">Rating</th>
                  <th className="text-right px-6 py-4 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-purple-500/5 hover:bg-dark-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=P'; }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white text-sm truncate max-w-[150px]">{product.name}</p>
                          <p className="text-slate-500 text-xs">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="badge bg-purple-500/10 text-purple-400">{product.category}</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-white">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`font-medium text-sm ${product.countInStock > 5 ? 'text-emerald-400' : product.countInStock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {product.countInStock === 0 ? 'Out of Stock' : `${product.countInStock} left`}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-amber-400 text-sm">★ {product.rating.toFixed(1)}</span>
                      <span className="text-slate-500 text-xs ml-1">({product.numReviews})</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400
                                     hover:bg-blue-500/20 text-xs font-medium transition-colors"
                        >
                          <FiEdit2 /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deletingId === product._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400
                                     hover:bg-red-500/20 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <FiTrash2 /> {deletingId === product._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
