import { useState, useEffect } from 'react';
import SectionWrapper from '../ui/SectionWrapper.jsx';
import Card from '../ui/Card.jsx';
import { getTestimonials } from '../../api/contentApi.js';
import { Star } from 'lucide-react';

const TestimonialsSection = ({ data }) => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getTestimonials().then((res) => setTestimonials(res.data)).catch(() => {});
  }, []);

  return (
    <SectionWrapper className="bg-tc-surface">
      <h2 className="text-3xl font-bold text-center mb-12">{data?.title || 'What People Say'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.slice(0, 6).map((t, i) => (
          <Card key={t._id} className="bg-tc-bg animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: Math.max(0, Math.floor(t.rating || 0)) }).map((_, i) => (
                <Star key={i} size={14} className="text-tc-primary fill-tc-primary" />
              ))}
            </div>
            <p className="text-sm text-tc-muted mb-6 italic">"{t.content}"</p>
            <div className="flex items-center gap-3">
              {t.avatar && <img loading="lazy" src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />}
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                {t.role && <p className="text-xs text-tc-dim">{t.role}{t.company ? `, ${t.company}` : ''}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
