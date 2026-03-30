const variants = {
  primary: 'bg-tc-primary text-tc-bg hover:opacity-90 font-bold hover-scale',
  secondary: 'bg-transparent border border-tc-border text-tc-muted hover:border-tc-primary hover:text-white',
  ghost: 'bg-transparent text-tc-muted hover:text-white hover:bg-white/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

const Button = ({ variant = 'primary', size = 'md', as: Tag = 'button', className = '', children, ...props }) => (
  <Tag
    className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 tracking-wider uppercase ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {children}
  </Tag>
);

export default Button;
