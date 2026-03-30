const SectionWrapper = ({ children, className = '', id, style }) => (
  <section
    id={id}
    className={`${className}`}
    style={{
      paddingTop: 'var(--section-py)',
      paddingBottom: 'var(--section-py)',
      paddingLeft: 'var(--section-px-mobile)',
      paddingRight: 'var(--section-px-mobile)',
      ...style,
    }}
  >
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>{children}</div>
  </section>
);

export default SectionWrapper;
