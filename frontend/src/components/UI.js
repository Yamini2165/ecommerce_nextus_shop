/**
 * components/Loader.js - Loading spinner
 */

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin`} />
      {text && <p className="text-slate-400 text-sm">{text}</p>}
    </div>
  );
};

/**
 * components/Message.js - Alert/message display
 */

export const Message = ({ type = 'error', children }) => {
  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  };

  return (
    <div className={`border rounded-xl px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
};

/**
 * components/Rating.js - Star rating display
 */

import { FiStar } from 'react-icons/fi';

export const Rating = ({ value, numReviews }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`text-sm ${
            star <= Math.round(value)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-600'
          }`}
        />
      ))}
    </div>
    {numReviews !== undefined && (
      <span className="text-slate-400 text-sm">({numReviews} reviews)</span>
    )}
  </div>
);

/**
 * components/CheckoutSteps.js - Multi-step checkout progress
 */

export const CheckoutSteps = ({ step }) => {
  const steps = ['Cart', 'Shipping', 'Payment', 'Order'];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < step;
        const isActive = stepNum === step;

        return (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-purple-500 text-white'
                : isCompleted
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-dark-700 text-slate-500'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                isCompleted ? 'bg-purple-400 text-dark-900' : ''
              }`}>
                {isCompleted ? '✓' : stepNum}
              </span>
              {s}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${isCompleted ? 'bg-purple-500' : 'bg-dark-600'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
