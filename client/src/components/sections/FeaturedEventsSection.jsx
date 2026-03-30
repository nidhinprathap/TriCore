import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from '../ui/SectionWrapper.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { getEvents } from '../../api/contentApi.js';
import { Calendar, MapPin } from 'lucide-react';

const FeaturedEventsSection = ({ data }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents({ limit: 6 }).then((res) => setEvents(res.data.events)).catch(() => {});
  }, []);

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold tracking-wide">{data?.title || 'Upcoming Events'}</h2>
        <Link to="/events"><Button variant="secondary" size="sm">View All</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <Link key={event._id} to={`/events/${event.slug}`}>
            <Card className="hover:border-tc-primary/30 transition-colors group animate-scale-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              {event.coverImage && (
                <div className="h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                  <img loading="lazy" src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <Badge variant="gold" className="mb-3">{event.category}</Badge>
              <h3 className="text-lg font-bold mb-2">{event.title}</h3>
              <div className="flex items-center gap-4 text-xs text-tc-muted">
                <span className="flex items-center gap-1"><Calendar size={12} />{new Date(event.dates?.start).toLocaleDateString()}</span>
                {event.venue?.city && <span className="flex items-center gap-1"><MapPin size={12} />{event.venue.city}</span>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default FeaturedEventsSection;
