const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-tc-border ${className}`}
    {...props}
  />
);

export default Skeleton;
