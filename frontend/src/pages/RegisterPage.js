/**
 * pages/RegisterPage.js - User Registration
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { Message } from '../components/UI';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      return setFormError('Passwords do not match');
    }
    if (password.length < 6) {
      return setFormError('Password must be at least 6 characters');
    }

    dispatch(registerUser({ name, email, password }));
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-orange-500 items-center justify-center mb-4">
            <span className="font-display font-bold text-white text-2xl">N</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-500 mt-2">Join NexusShop and start shopping</p>
        </div>

        <div className="card p-8">
          {displayError && <Message type="error" className="mb-6">{displayError}</Message>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-2 block">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-2 block">Confirm password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
