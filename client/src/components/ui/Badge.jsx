const variants = {
  default: 'bg-tc-border text-tc-muted',
  gold: 'bg-tc-primary/10 text-tc-primary border border-tc-primary/20',
  green: 'bg-green-500/10 text-green-400 border border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  blue: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
};

const Badge = ({ variant = 'default', className = '', children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${variants[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
