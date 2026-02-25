/**
 * pages/ProfilePage.js - User profile editor
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, clearError, clearSuccess } from '../redux/slices/authSlice';
import { Message } from '../components/UI';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    return () => { dispatch(clearError()); dispatch(clearSuccess()); };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (password && password !== confirmPassword) {
      return setFormError('Passwords do not match');
    }

    dispatch(updateUserProfile({
      name,
      email,
      ...(password && { password }),
    }));
  };

  return (
    <div className="page-container max-w-lg mx-auto">
      <h1 className="section-title mb-8">My Profile</h1>

      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-purple-500/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
            <span className="font-display font-bold text-white text-2xl">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-xl">{userInfo?.name}</p>
            <p className="text-slate-500 text-sm">{userInfo?.email}</p>
            {userInfo?.isAdmin && <span className="badge-info mt-1 inline-block">Admin</span>}
          </div>
        </div>

        {(formError || error) && <Message type="error" className="mb-4">{formError || error}</Message>}
        {success && <Message type="success" className="mb-4">Profile updated successfully!</Message>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-field pl-10" required />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10" required />
            </div>
          </div>

          <div className="border-t border-purple-500/10 pt-5">
            <p className="text-slate-500 text-sm mb-4">Leave password fields blank to keep current password</p>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password" className="input-field pl-10" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
