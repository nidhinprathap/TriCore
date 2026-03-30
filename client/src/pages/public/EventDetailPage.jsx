import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent, getEventItems } from '../../api/contentApi.js';
import SectionWrapper from '../../components/ui/SectionWrapper.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Calendar, MapPin, Clock, Phone, Mail } from 'lucide-react';

const tabs = ['overview', 'schedule', 'rules', 'prizes', 'sponsors'];

const EventDetailPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([getEvent(slug), getEventItems(slug)])
      .then(([eventRes, itemsRes]) => { setEvent(eventRes.data); setItems(itemsRes.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-64 h-8" /></div>;
  if (!event) return <SectionWrapper><h1 className="text-3xl font-bold">Event not found</h1></SectionWrapper>;

  return (
    <>
      <SectionWrapper className="min-h-[40vh] flex items-end" style={{ backgroundImage: event.coverImage ? `linear-gradient(to top, var(--color-background), transparent), url(${event.coverImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div>
          <Badge variant="gold" className="mb-4">{event.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{event.title}</h1>
          {event.tagline && <p className="text-lg text-tc-muted mb-4">{event.tagline}</p>}
          <div className="flex flex-wrap gap-6 text-sm text-tc-muted">
            <span className="flex items-center gap-1.5"><Calendar size={16} />{new Date(event.dates?.start).toLocaleDateString()}</span>
            {event.venue?.name && <span className="flex items-center gap-1.5"><MapPin size={16} />{event.venue.name}, {event.venue.city}</span>}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="flex gap-2 mb-10 border-b border-tc-border pb-4 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs font-semibold tracking-[2px] uppercase transition-colors ${activeTab === tab ? 'text-tc-primary border-b-2 border-tc-primary' : 'text-tc-dim hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-tc-muted leading-relaxed whitespace-pre-wrap">{event.description}</p>
              {items.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-bold mb-6">Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <Card key={item._id} className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-xs text-tc-dim mt-1">{item.type} · {item.gender}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-tc-primary font-bold">{item.fee === 0 ? 'Free' : `₹${item.fee}`}</div>
                          <Link to={`/register?event=${slug}&item=${item._id}`}><Button size="sm" className="mt-2">Register</Button></Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              {event.contacts?.length > 0 && (
                <Card>
                  <h4 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Contact</h4>
                  {event.contacts.map((c, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-tc-dim">{c.role}</p>
                      {c.phone && <p className="text-xs text-tc-muted flex items-center gap-1 mt-1"><Phone size={10} />{c.phone}</p>}
                      {c.email && <p className="text-xs text-tc-muted flex items-center gap-1"><Mail size={10} />{c.email}</p>}
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="max-w-2xl">
            {event.schedule?.map((s, i) => (
              <div key={i} className="flex gap-6 py-4 border-b border-tc-border last:border-0">
                <div className="text-sm font-bold text-tc-primary w-24 flex-shrink-0 flex items-center gap-1.5"><Clock size={14} />{s.time}</div>
                <div>
                  <p className="font-semibold">{s.activity}</p>
                  {s.description && <p className="text-sm text-tc-muted mt-1">{s.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <ul className="max-w-2xl space-y-3">
            {event.rules?.map((rule, i) => (
              <li key={i} className="flex gap-3 text-tc-muted">
                <span className="text-tc-primary font-bold">{i + 1}.</span> {rule}
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'prizes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            {event.prizes?.map((p, i) => (
              <Card key={i} className="text-center">
                <div className="text-2xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                <h4 className="font-bold mb-1">{p.position}</h4>
                <p className="text-sm text-tc-muted">{p.prize}</p>
                {p.amount > 0 && <p className="text-tc-primary font-bold mt-2">₹{p.amount.toLocaleString()}</p>}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {event.sponsors?.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 p-4 border border-tc-border hover:border-tc-primary/30 transition-colors">
                {s.logo && <img loading="lazy" src={s.logo} alt={s.name} className="h-12 object-contain" />}
                <p className="text-sm font-medium">{s.name}</p>
                <Badge variant="gold">{s.tier}</Badge>
              </a>
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
};

export default EventDetailPage;
