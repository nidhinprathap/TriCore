import SectionWrapper from '../ui/SectionWrapper.jsx';

const TrustPartnersSection = ({ data }) => (
  <SectionWrapper className="bg-tc-surface">
    <h2 className="text-center text-[10px] font-semibold tracking-[4px] uppercase text-tc-dim mb-8">
      {data?.title || 'Trusted By'}
    </h2>
    <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
      {data?.partners?.map((p, i) => (
        <img key={i} src={p.logo} alt={p.name} className="h-8 grayscale hover:grayscale-0 transition-all" />
      ))}
    </div>
  </SectionWrapper>
);

export default TrustPartnersSection;
