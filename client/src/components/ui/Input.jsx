import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={`w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm placeholder-tc-dim focus:border-tc-primary focus:outline-none transition-colors ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
