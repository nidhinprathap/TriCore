import { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      className={`w-full min-h-[80px] px-3 py-2.5 bg-tc-card border border-tc-border text-white text-sm placeholder-tc-dim focus:border-tc-primary focus:outline-none transition-colors resize-y ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
export default Textarea;
