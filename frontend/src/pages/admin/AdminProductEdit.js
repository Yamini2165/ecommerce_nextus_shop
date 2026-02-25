/**
 * pages/admin/AdminProductEdit.js - Create/Edit Product Form
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { Message, Loader } from '../../components/UI';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive', 'Other'];

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.data;
        setName(p.name);
        setPrice(p.price);
        setImage(p.image);
        setBrand(p.brand);
        setCategory(p.category);
        setCountInStock(p.countInStock);
        setDescription(p.description);
        setIsFeatured(p.isFeatured);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditing]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.data.url);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed. Using URL instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !image || !brand || !category || !description || countInStock === '') {
      return setError('Please fill in all required fields');
    }

    try {
      setSaving(true);
      setError(null);

      const productData = {
        name: name.trim(),
        price: Number(price),
        image,
        brand: brand.trim(),
        category,
        countInStock: Number(countInStock),
        description: description.trim(),
        isFeatured,
      };

      if (isEditing) {
        await api.put(`/products/${id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', productData);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading product..." />;

  return (
    <div className="page-container max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
      >
        <FiArrowLeft /> Back to Products
      </button>

      <h1 className="section-title mb-8">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>

      {error && <Message type="error" className="mb-6">{error}</Message>}

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple AirPods Pro"
              className="input-field"
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Price ($) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.99"
                min="0"
                step="0.01"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Stock Count *</label>
              <input
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="100"
                min="0"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Apple"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Product Image *</label>
            <div className="space-y-3">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field"
              />

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer btn-secondary !py-2 !px-4 !text-sm">
                  <FiUpload /> Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <span className="text-slate-500 text-sm">or enter URL above</span>
              </div>

              {image && (
                <div className="mt-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl border border-purple-500/20"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product features, specifications..."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-xl">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-500"
            />
            <div>
              <label htmlFor="featured" className="text-white font-medium cursor-pointer">Featured Product</label>
              <p className="text-slate-500 text-xs">Featured products appear in the homepage hero section</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3.5 text-base">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEditing ? 'Saving...' : 'Creating...'}
                </span>
              ) : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit;
