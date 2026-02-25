/**
 * components/Navbar.js - Main Navigation
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut,
  FiSettings, FiPackage, FiBarChart2, FiSearch
} from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">N</span>
            </div>
            <span className="font-display font-bold text-white text-xl hidden sm:block">
              Nexus<span className="text-gradient">Shop</span>
            </span>
          </Link>

          {/* ── Desktop Search ── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-dark-800 border border-purple-500/20 rounded-xl pl-9 pr-4 py-2
                           text-white text-sm placeholder-slate-500
                           focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </form>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300
                         hover:text-white hover:bg-dark-700 transition-all text-sm font-medium"
            >
              <FiShoppingCart className="text-lg" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full
                                 text-xs font-bold text-white flex items-center justify-center
                                 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border
                             border-purple-500/20 text-purple-300 hover:border-purple-500/40
                             transition-all text-sm font-medium"
                >
                  <FiUser className="text-lg" />
                  <span className="max-w-[100px] truncate">{userInfo.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass rounded-xl border border-purple-500/20
                                  shadow-xl shadow-black/50 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300
                                 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <FiUser /> Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300
                                 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <FiPackage /> My Orders
                    </Link>

                    {userInfo.isAdmin && (
                      <>
                        <hr className="border-purple-500/10 my-1" />
                        <p className="px-4 py-1 text-xs text-slate-500 uppercase tracking-wider">Admin</p>
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300
                                     hover:text-white hover:bg-dark-700 transition-colors"
                        >
                          <FiBarChart2 /> Dashboard
                        </Link>
                        <Link
                          to="/admin/products"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300
                                     hover:text-white hover:bg-dark-700 transition-colors"
                        >
                          <FiSettings /> Manage Products
                        </Link>
                        <Link
                          to="/admin/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300
                                     hover:text-white hover:bg-dark-700 transition-colors"
                        >
                          <FiPackage /> Manage Orders
                        </Link>
                      </>
                    )}

                    <hr className="border-purple-500/10 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-400
                                 hover:text-red-300 hover:bg-dark-700 transition-colors w-full"
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-5 !text-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart className="text-xl text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full
                                 text-xs font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-purple-500/10 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-9"
              />
            </div>
          </form>

          {userInfo ? (
            <>
              <p className="text-sm text-slate-500">Signed in as <span className="text-purple-400">{userInfo.name}</span></p>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Profile</Link>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">My Orders</Link>
              {userInfo.isAdmin && (
                <>
                  <hr className="border-purple-500/10" />
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-purple-400 hover:text-purple-300">Admin Dashboard</Link>
                </>
              )}
              <button onClick={handleLogout} className="w-full text-left py-2 text-red-400 hover:text-red-300">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-center">Register</Link>
            </div>
          )}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
