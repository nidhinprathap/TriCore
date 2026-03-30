import { Link } from 'react-router-dom';
import SectionWrapper from '../ui/SectionWrapper.jsx';
import Button from '../ui/Button.jsx';

const FinalCtaSection = ({ data }) => (
  <SectionWrapper className="text-center">
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">{data?.title || 'Ready?'}</h2>
    {data?.subtitle && <p className="text-lg text-tc-muted mb-10 max-w-xl mx-auto animate-fade-in-up stagger-1">{data.subtitle}</p>}
    {data?.ctaLabel && (
      <div className="animate-fade-in-up stagger-1">
        <Link to={data.ctaHref || '/contact'}>
          <Button size="lg">{data.ctaLabel}</Button>
        </Link>
      </div>
    )}
  </SectionWrapper>
);

export default FinalCtaSection;
