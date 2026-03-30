import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminEvents, deleteEvent } from '../../api/eventsApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

const statusVariant = { draft: 'default', published: 'green', archived: 'yellow', cancelled: 'red' };

const EventsManagerPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = () => {
    setLoading(true);
    getAdminEvents({ limit: 50 }).then((res) => setEvents(res.data.events)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button size="sm" onClick={() => navigate('/admin/events/new')}><Plus size={14} /> New Event</Button>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event._id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {event.coverImage && <img loading="lazy" src={event.coverImage} alt="" className="w-16 h-16 object-cover flex-shrink-0" />}
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
                    <span className="text-xs text-tc-dim flex items-center gap-1"><Calendar size={10} />{new Date(event.dates?.start).toLocaleDateString()}</span>
                    <Badge variant="gold">{event.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/events/${event._id}`)}><Edit size={14} /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(event._id)}><Trash2 size={14} className="text-red-400" /></Button>
              </div>
            </Card>
          ))}
          {events.length === 0 && <Card className="text-center py-12"><p className="text-tc-dim">No events yet</p></Card>}
        </div>
      )}
    </div>
  );
};

export default EventsManagerPage;
