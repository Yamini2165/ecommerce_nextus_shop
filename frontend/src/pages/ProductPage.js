/**
 * pages/ProductPage.js - Product Detail with Agentic AI Price Tracker
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../utils/api';
import { Loader, Message, Rating } from '../components/UI';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiMinus, FiPlus, FiBell } from 'react-icons/fi';
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

  // Agentic AI State
  const [targetPrice, setTargetPrice] = useState('');
  const [isTracking, setIsTracking] = useState(false);

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

  const handleSetPriceAlert = async () => {
    if (!userInfo) {
      toast.error('Please login to set a price alert');
      return navigate('/login');
    }
    try {
      await api.post('/ai/price-tracker', {
        productId: product._id,
        targetPrice: Number(targetPrice),
      });
      setIsTracking(true);
      toast.success(`AI Agent is now tracking this for $${targetPrice}!`);
    } catch (err) {
      toast.error('Failed to set AI tracker');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message type="error">{error}</Message>;

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 text-sm transition-colors">
        <FiArrowLeft /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="rounded-2xl overflow-hidden bg-dark-800 aspect-square group">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="flex flex-col">
          <p className="text-purple-400 text-sm uppercase tracking-widest">{product.brand}</p>
          <h1 className="font-display text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
          <Rating value={product.rating} numReviews={product.numReviews} />

          <div className="my-6">
            <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
          </div>

          {/* ── Agentic AI UI ── */}
          <div className="card p-5 border border-purple-500/20 bg-purple-500/5 mb-8 rounded-2xl">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FiBell className="text-purple-400" /> AI Price Tracker
            </h4>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Target Price ($)" 
                className="input-field py-2 text-sm bg-dark-900"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
              <button onClick={handleSetPriceAlert} className="btn-primary py-2 px-6 text-sm whitespace-nowrap">
                {isTracking ? 'Active' : 'Set Alert'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Autonomous agent will notify you on price drop</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
              <FiShoppingCart /> Add to Cart
            </button>
            <button onClick={() => { handleAddToCart(); navigate('/cart'); }} className="btn-secondary flex-1">
              Buy Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;