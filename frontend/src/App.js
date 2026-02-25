/**
 * App.js - Root Application Component with React Router v6
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProductEdit from './pages/admin/AdminProductEdit';

// Protected Route Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen bg-dark-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ── Private Routes (require login) ── */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/place-order" element={<PlaceOrderPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
              </Route>

              {/* ── Admin Routes ── */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/create" element={<AdminProductEdit />} />
                <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>

              {/* ── 404 Fallback ── */}
              <Route path="*" element={
                <div className="page-container flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <h1 className="font-display text-8xl font-bold text-gradient mb-4">404</h1>
                    <p className="text-slate-400 text-xl mb-6">Page not found</p>
                    <a href="/" className="btn-primary inline-block">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a26',
              color: '#f8fafc',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
