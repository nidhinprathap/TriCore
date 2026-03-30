import SectionWrapper from '../ui/SectionWrapper.jsx';

const StatsGridSection = ({ data }) => (
  <SectionWrapper className="bg-tc-surface">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {data?.stats?.map((stat, i) => (
        <div key={i}>
          <div className="text-4xl font-extrabold text-tc-primary mb-2">{stat.value}</div>
          <div className="text-xs font-semibold tracking-[2px] uppercase text-tc-dim">{stat.label}</div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default StatsGridSection;
