/**
 * pages/ProductPage.js - Single Product Detail Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../utils/api';
import { Loader, Message, Rating } from '../components/UI';
import { FiShoppingCart, FiArrowLeft, FiStar, FiCheck, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    }));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setReviewLoading(true);
      setReviewError(null);
      await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Review submitted!');
      setReviewComment('');
      // Refresh product to show new review
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader text="Loading product..." />;
  if (error) return (
    <div className="page-container">
      <Message type="error">{error}</Message>
    </div>
  );
  if (!product) return null;

  return (
    <div className="page-container animate-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
      >
        <FiArrowLeft /> Back to Products
      </button>

      {/* Product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-dark-800 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Product'; }}
          />
          {product.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="badge bg-gradient-to-r from-purple-500 to-orange-500 text-white">✦ Featured</span>
            </div>
          )}
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
              <span className="badge-danger text-lg font-bold px-6 py-3">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <p className="text-purple-400 text-sm font-medium uppercase tracking-wider">{product.brand}</p>
            <p className="text-slate-500 text-sm">{product.category}</p>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <Rating value={product.rating} numReviews={product.numReviews} />
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-display text-4xl font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className={`text-sm font-medium ${
              product.countInStock > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {product.countInStock > 0
                ? <span className="flex items-center gap-1"><FiCheck /> In Stock ({product.countInStock} left)</span>
                : 'Out of Stock'
              }
            </span>
          </div>

          {/* Quantity selector */}
          {product.countInStock > 0 && (
            <div className="mb-6">
              <label className="text-slate-400 text-sm mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 rounded-lg bg-dark-700 border border-purple-500/20 text-white
                             flex items-center justify-center hover:border-purple-500/50 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="font-display font-bold text-xl text-white w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  className="w-10 h-10 rounded-lg bg-dark-700 border border-purple-500/20 text-white
                             flex items-center justify-center hover:border-purple-500/50 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.countInStock === 0}
              className="btn-secondary flex-1"
            >
              Buy Now →
            </button>
          </div>

          {/* Features list */}
          <div className="space-y-2 text-sm text-slate-400">
            {['Free shipping over $100', '30-day return policy', '2-year warranty', 'Secure checkout'].map((feat) => (
              <div key={feat} className="flex items-center gap-2">
                <FiCheck className="text-purple-400 flex-shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="border border-purple-500/10 rounded-2xl overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-purple-500/10">
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-purple-500/10 text-purple-400 border-b-2 border-purple-500'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab} {tab === 'reviews' && `(${product.numReviews})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'description' ? (
            <p className="text-slate-400 leading-relaxed">{product.description}</p>
          ) : (
            <div className="space-y-6">
              {/* Reviews list */}
              {product.reviews.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No reviews yet. Be the first!</p>
              ) : (
                product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-dark-600 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">{review.name}</span>
                      <span className="text-slate-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={review.rating} />
                    <p className="text-slate-400 text-sm mt-2">{review.comment}</p>
                  </div>
                ))
              )}

              {/* Review form */}
              {userInfo ? (
                <form onSubmit={handleSubmitReview} className="mt-6 p-4 bg-dark-800 rounded-xl">
                  <h4 className="font-display font-semibold text-white mb-4">Write a Review</h4>

                  {reviewError && <Message type="error" className="mb-4">{reviewError}</Message>}

                  <div className="mb-4">
                    <label className="text-slate-400 text-sm mb-2 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-2xl"
                        >
                          <FiStar className={`${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="input-field resize-none mb-4"
                    required
                  />

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="btn-primary"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-slate-500 text-center py-4">
                  <Link to="/login" className="text-purple-400 hover:underline">Sign in</Link> to write a review
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
