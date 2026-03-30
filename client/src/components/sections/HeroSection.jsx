import SectionWrapper from '../ui/SectionWrapper.jsx';
import Button from '../ui/Button.jsx';
import { Link } from 'react-router-dom';

const HeroSection = ({ data }) => (
  <SectionWrapper className="min-h-[80vh] flex items-center">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight animate-fade-in-up">
        {data?.headline || 'Welcome'}
      </h1>
      {data?.subheadline && (
        <p className="text-lg md:text-xl text-tc-muted mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1">{data.subheadline}</p>
      )}
      {data?.ctaLabel && (
        <div className="animate-fade-in-up stagger-2">
          <Link to={data.ctaHref || '/events'}>
            <Button size="lg">{data.ctaLabel}</Button>
          </Link>
        </div>
      )}
    </div>
  </SectionWrapper>
);

export default HeroSection;
