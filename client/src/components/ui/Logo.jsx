const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { mark: 28, text: 14, tag: 8, tracking: '3px', gap: 8 },
    md: { mark: 36, text: 20, tag: 9, tracking: '4px', gap: 10 },
    lg: { mark: 48, text: 28, tag: 11, tracking: '5px', gap: 12 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${className}`} style={{ gap: s.gap }}>
      {/* Three Pillars Mark */}
      <svg width={s.mark} height={s.mark} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-light, #E8CC6E)" />
            <stop offset="50%" stopColor="var(--color-primary, #D4AF37)" />
            <stop offset="100%" stopColor="var(--color-primary-dark, #B8962E)" />
          </linearGradient>
        </defs>
        {/* Pillar 1 (left) */}
        <polygon points="8,28 22,8 36,28" fill="url(#logoGold)" />
        <rect x="8" y="28" width="28" height="68" fill="url(#logoGold)" />
        {/* Pillar 2 (center — tallest) */}
        <polygon points="38,18 54,0 70,18" fill="url(#logoGold)" />
        <rect x="38" y="18" width="32" height="78" fill="url(#logoGold)" />
        {/* Pillar 3 (right) */}
        <polygon points="72,28 86,8 100,28" fill="url(#logoGold)" />
        <rect x="72" y="28" width="28" height="68" fill="url(#logoGold)" />
        {/* Base line */}
        <rect x="4" y="96" width="96" height="2" fill="var(--color-primary, #D4AF37)" opacity="0.4" />
      </svg>

      {showText && (
        <div>
          <div style={{ fontSize: s.text, fontWeight: 800, letterSpacing: s.tracking, lineHeight: 1 }} className="text-white">
            TRICORE
          </div>
          <div style={{ fontSize: s.tag, fontWeight: 500, letterSpacing: '3px' }} className="text-tc-primary">
            EVENTS
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
