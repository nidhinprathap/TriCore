import SectionWrapper from '../ui/SectionWrapper.jsx';
import Card from '../ui/Card.jsx';
import { Trophy, Building, Users } from 'lucide-react';

const iconMap = { trophy: Trophy, building: Building, users: Users };

const ServicePillarsSection = ({ data }) => (
  <SectionWrapper>
    <h2 className="text-3xl font-bold text-center mb-12 tracking-wide animate-fade-in-up">{data?.title || 'What We Do'}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data?.pillars?.map((pillar, i) => {
        const Icon = iconMap[pillar.icon] || Trophy;
        return (
          <Card key={i} className="text-center p-8 hover:border-tc-primary/30 transition-colors animate-fade-in-up hover-gold-glow" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
            <div className="w-14 h-14 mx-auto mb-6 bg-tc-primary/10 flex items-center justify-center">
              <Icon size={28} className="text-tc-primary" />
            </div>
            <h3 className="text-lg font-bold mb-3">{pillar.title}</h3>
            <p className="text-sm text-tc-muted">{pillar.description}</p>
          </Card>
        );
      })}
    </div>
  </SectionWrapper>
);

export default ServicePillarsSection;
