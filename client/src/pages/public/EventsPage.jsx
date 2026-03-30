import { useState } from 'react';
import { Link } from 'react-router-dom';
import useEvents from '../../hooks/useEvents.js';
import SectionWrapper from '../../components/ui/SectionWrapper.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Calendar, MapPin } from 'lucide-react';

const categories = ['all', 'sports', 'corporate', 'community'];

const EventsPage = () => {
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const { events, pages: totalPages, loading } = useEvents({
    category: category === 'all' ? undefined : category,
    page,
    limit: 12,
  });

  return (
    <>
      <SectionWrapper className="min-h-[30vh] flex items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center w-full">Events</h1>
      </SectionWrapper>
      <SectionWrapper>
        <div className="flex gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <Button key={cat} variant={category === cat ? 'primary' : 'secondary'} size="sm" onClick={() => { setCategory(cat); setPage(1); }}>
              {cat}
            </Button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-64" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event._id} to={`/events/${event.slug}`}>
                <Card className="hover:border-tc-primary/30 transition-colors group h-full">
                  {event.coverImage && (
                    <div className="h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                      <img loading="lazy" src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <Badge variant="gold" className="mb-3">{event.category}</Badge>
                  <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                  {event.tagline && <p className="text-sm text-tc-muted mb-3">{event.tagline}</p>}
                  <div className="flex items-center gap-4 text-xs text-tc-dim">
                    <span className="flex items-center gap-1"><Calendar size={12} />{new Date(event.dates?.start).toLocaleDateString()}</span>
                    {event.venue?.city && <span className="flex items-center gap-1"><MapPin size={12} />{event.venue.city}</span>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button key={i} variant={page === i + 1 ? 'primary' : 'secondary'} size="sm" onClick={() => setPage(i + 1)}>
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
};

export default EventsPage;
