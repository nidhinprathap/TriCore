const Card = ({ className = '', children, ...props }) => (
  <div
    className={`bg-tc-card border border-tc-border p-6 hover-gold-glow ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
