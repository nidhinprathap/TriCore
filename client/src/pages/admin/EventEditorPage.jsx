import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminEvent, createEvent, updateEvent } from '../../api/eventsApi.js';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import ImageUpload from '../../components/ui/ImageUpload.jsx';

const defaultEvent = { title: '', slug: '', tagline: '', description: '', category: 'sports', status: 'draft', coverImage: '', dates: { start: '', end: '', registrationDeadline: '' }, venue: { name: '', address: '', city: '', mapUrl: '' }, registration: { enabled: true, maxParticipants: '', requiresApproval: false } };

const EventEditorPage = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(defaultEvent)));
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      getAdminEvent(id).then((res) => setForm(res.data)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id]);

  const update = (path, value) => {
    setForm((prev) => {
      const copy = { ...prev };
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...obj[keys[i]] }; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) { await createEvent(form); }
      else { await updateEvent(id, form); }
      navigate('/admin/events');
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'New Event' : 'Edit Event'}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Basic Info</h3>
          <div className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
            <Input label="Slug" value={form.slug} onChange={(e) => update('slug', e.target.value)} required />
            <Input label="Tagline" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
            <Textarea label="Description" value={form.description} onChange={(e) => update('description', e.target.value)} />
            <ImageUpload label="Cover Image" value={form.coverImage} onChange={(url) => update('coverImage', url)} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm">
                  <option value="sports">Sports</option>
                  <option value="corporate">Corporate</option>
                  <option value="community">Community</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Dates</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="datetime-local" value={form.dates?.start?.slice?.(0, 16) || ''} onChange={(e) => update('dates.start', e.target.value)} required />
            <Input label="End Date" type="datetime-local" value={form.dates?.end?.slice?.(0, 16) || ''} onChange={(e) => update('dates.end', e.target.value)} />
          </div>
          <Input label="Registration Deadline" type="datetime-local" value={form.dates?.registrationDeadline?.slice?.(0, 16) || ''} onChange={(e) => update('dates.registrationDeadline', e.target.value)} className="mt-4" />
        </Card>
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Venue</h3>
          <div className="space-y-4">
            <Input label="Name" value={form.venue?.name || ''} onChange={(e) => update('venue.name', e.target.value)} />
            <Input label="Address" value={form.venue?.address || ''} onChange={(e) => update('venue.address', e.target.value)} />
            <Input label="City" value={form.venue?.city || ''} onChange={(e) => update('venue.city', e.target.value)} />
          </div>
        </Card>
        <div className="flex gap-3">
          <Button type="submit">{isNew ? 'Create Event' : 'Save Changes'}</Button>
          {!isNew && <Button variant="secondary" type="button" onClick={() => navigate(`/admin/events/${id}/items`)}>Manage Sport Items</Button>}
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/events')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EventEditorPage;
