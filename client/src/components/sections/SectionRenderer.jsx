import HeroSection from './HeroSection.jsx';
import ServicePillarsSection from './ServicePillarsSection.jsx';
import TrustPartnersSection from './TrustPartnersSection.jsx';
import FeaturedEventsSection from './FeaturedEventsSection.jsx';
import TestimonialsSection from './TestimonialsSection.jsx';
import FinalCtaSection from './FinalCtaSection.jsx';
import ContentBlockSection from './ContentBlockSection.jsx';
import TeamSection from './TeamSection.jsx';
import ContactFormSection from './ContactFormSection.jsx';
import FaqSection from './FaqSection.jsx';
import StatsGridSection from './StatsGridSection.jsx';

const sectionMap = {
  'hero': HeroSection,
  'service-pillars': ServicePillarsSection,
  'trust-partners': TrustPartnersSection,
  'featured-events': FeaturedEventsSection,
  'testimonials': TestimonialsSection,
  'final-cta': FinalCtaSection,
  'content-block': ContentBlockSection,
  'team': TeamSection,
  'contact-form': ContactFormSection,
  'faq': FaqSection,
  'stats-grid': StatsGridSection,
};

const SectionRenderer = ({ sections = [] }) => (
  <>
    {sections.map((section) => {
      const Component = sectionMap[section.type];
      if (!Component || section.enabled === false) return null;
      return <Component key={section._id} data={section.data} />;
    })}
  </>
);

export default SectionRenderer;
