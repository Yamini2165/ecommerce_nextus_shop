/**
 * components/Footer.js
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-purple-500/10 bg-dark-800 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">N</span>
            </div>
            <span className="font-display font-bold text-white text-xl">
              Nexus<span className="text-gradient">Shop</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Premium products curated for the discerning buyer. Quality, reliability, and style in every purchase.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
          <div className="space-y-2">
            {['/', '/cart', '/login', '/register'].map((path, i) => (
              <div key={path}>
                <Link to={path} className="text-slate-500 hover:text-purple-400 transition-colors text-sm">
                  {['Home', 'Cart', 'Sign In', 'Register'][i]}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Categories</h4>
          <div className="space-y-2">
            {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'].map((cat) => (
              <div key={cat}>
                <Link to={`/?category=${cat}`} className="text-slate-500 hover:text-purple-400 transition-colors text-sm">
                  {cat}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-purple-500/10 text-center">
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} NexusShop. Built with MERN Stack & ♥
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
