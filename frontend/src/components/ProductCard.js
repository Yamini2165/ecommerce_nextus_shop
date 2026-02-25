/**
 * components/ProductCard.js - Product listing card
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { FiStar, FiShoppingCart, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`text-xs ${
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-600'
          }`}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock === 0) return;

    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1,
    }));

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card group relative">
      {/* Featured badge */}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge bg-gradient-to-r from-purple-500 to-orange-500 text-white text-xs px-2 py-1">
            ✦ Featured
          </span>
        </div>
      )}

      {/* Out of stock overlay */}
      {product.countInStock === 0 && (
        <div className="absolute inset-0 bg-dark-900/70 z-10 flex items-center justify-center rounded-2xl">
          <span className="badge-danger text-sm font-bold">Out of Stock</span>
        </div>
      )}

      {/* Product image */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product._id}`}
            className="p-3 bg-white/10 backdrop-blur rounded-xl text-white hover:bg-white/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <FiEye className="text-lg" />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="p-3 bg-purple-500/80 backdrop-blur rounded-xl text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            <FiShoppingCart className="text-lg" />
          </button>
        </div>
      </Link>

      {/* Product info */}
      <div className="p-4">
        <p className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display font-semibold text-white text-sm leading-snug mb-2
                         hover:text-purple-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-slate-500">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xl text-white">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/20
                       text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/20
                       hover:border-purple-500/40 transition-all active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="text-sm" />
            Add
          </button>
        </div>

        {product.countInStock <= 5 && product.countInStock > 0 && (
          <p className="text-xs text-amber-400 mt-2">Only {product.countInStock} left!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
