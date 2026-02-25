/**
 * pages/HomePage.js - Product Catalog with Search & Filter
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Loader, Message } from '../components/UI';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rated', value: 'rating' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const keyword = new URLSearchParams(location.search).get('keyword') || '';
  const urlCategory = new URLSearchParams(location.search).get('category') || '';

  useEffect(() => {
    if (urlCategory) setCategory(urlCategory);
  }, [urlCategory]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        sort,
        ...(keyword && { keyword }),
        ...(category && { category }),
      });
      const { data } = await api.get(`/products?${params}`);
      
      // Safety check for data structure
      setProducts(data?.data || []); 
      setTotalPages(data?.pages || 1);
      setTotalProducts(data?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, sort, keyword, category]);

  useEffect(() => {
    setPage(1);
  }, [keyword, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setCategory('');
    setSort('newest');
    navigate('/');
  };

  const hasActiveFilters = category || keyword || sort !== 'newest';

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ── */}
      {!keyword && !category && page === 1 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-b border-purple-500/10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
            <div className="max-w-2xl">
              <p className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-4">
                ✦ Premium Collection 2024
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
                Shop the{' '}
                <span className="text-gradient">Future</span>
                <br />of Commerce
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                Discover curated products from world-class brands. Quality meets convenience in every transaction.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary"
                >
                  Explore Products
                </button>
                <button
                  onClick={() => setCategory('Electronics')}
                  className="btn-secondary"
                >
                  Shop Electronics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="products">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            {keyword ? (
              <h2 className="section-title">
                Results for <span className="text-purple-400">"{keyword}"</span>
              </h2>
            ) : category ? (
              <h2 className="section-title">{category}</h2>
            ) : (
              <h2 className="section-title">All Products</h2>
            )}
            {!loading && (
              <p className="text-slate-500 text-sm mt-1">{totalProducts} products found</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field py-2 pr-8 appearance-none cursor-pointer text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-secondary !py-2 !px-3 flex items-center gap-1"
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={`hidden sm:block w-56 flex-shrink-0`}>
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setCategory(''); navigate('/'); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !category ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat === category ? '' : cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'text-slate-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <FiX /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {showFilters && (
            <div className="sm:hidden fixed inset-0 z-50 bg-dark-900/95 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-white text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}><FiX className="text-xl text-slate-400" /></button>
              </div>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                      category === cat ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-dark-800 text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <Loader text="Loading products..." />
            ) : error ? (
              <Message type="error">{error}</Message>
            // Safety Check: Added "products?.length" and "!products" check
            ) : !products || products?.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="font-display text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                  {/* Safety Check: Optional Chaining on map */}
                  {products?.map((product, i) => (
                    <div key={product._id} className="animate-in" style={{ animationDelay: `${i * 50}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-secondary !py-2 !px-4 disabled:opacity-30"
                    >
                      ← Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                          page === i + 1
                            ? 'bg-purple-500 text-white'
                            : 'bg-dark-700 text-slate-400 hover:bg-dark-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

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
        </div>
      </div>
    </div>
  );
};

export default HomePage;