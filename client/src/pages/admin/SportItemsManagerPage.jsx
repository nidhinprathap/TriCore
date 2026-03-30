import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminEvent, getEventItems, createEventItem, updateEventItem, deleteEventItem } from '../../api/eventsApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

const typeVariant = { individual: 'gold', team: 'green', group: 'blue' };
const defaultItem = { name: '', description: '', category: '', type: 'individual', fee: 0, maxParticipants: '', gender: 'any', enabled: true, order: 0 };

const SportItemsManagerPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(defaultItem)));
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evRes, itemsRes] = await Promise.all([getAdminEvent(eventId), getEventItems(eventId)]);
      setEvent(evRes.data);
      setItems(itemsRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [eventId]);

  const handleSave = async () => {
    try {
      const data = { ...form, fee: Number(form.fee) || 0, maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined, order: Number(form.order) || 0 };
      if (editId) await updateEventItem(eventId, editId, data);
      else await createEventItem(eventId, data);
      setModal(false); setEditId(null); setForm(JSON.parse(JSON.stringify(defaultItem)));
      fetchData();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to save'); }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', category: item.category || '', type: item.type, fee: item.fee, maxParticipants: item.maxParticipants || '', gender: item.gender, enabled: item.enabled, order: item.order });
    setEditId(item._id); setModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sport item?')) return;
    try { await deleteEventItem(eventId, id); fetchData(); } catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
  };

  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div>
      <button onClick={() => navigate(`/admin/events/${eventId}`)} className="flex items-center gap-2 text-tc-muted hover:text-white text-sm mb-4"><ArrowLeft size={14} /> Back to Event</button>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Sport Items</h1><p className="text-sm text-tc-dim">{event?.title}</p></div>
        <Button size="sm" onClick={() => { setEditId(null); setForm(JSON.parse(JSON.stringify(defaultItem))); setModal(true); }}><Plus size={14} /> Add Item</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item._id} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{item.name}</p>
                <Badge variant={typeVariant[item.type]}>{item.type}</Badge>
                {!item.enabled && <Badge variant="red">Disabled</Badge>}
              </div>
              <p className="text-xs text-tc-dim mt-1">Fee: ₹{item.fee} · Max: {item.maxParticipants || '∞'} · Current: {item.currentCount || 0} · {item.gender}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Edit size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)}><Trash2 size={14} className="text-red-400" /></Button>
            </div>
          </Card>
        ))}
        {items.length === 0 && <Card className="text-center py-12"><p className="text-tc-dim">No sport items yet</p></Card>}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editId ? 'Edit Sport Item' : 'Add Sport Item'} className="max-w-lg">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Athletics, Swimming" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm focus:border-tc-primary focus:outline-none">
                <option value="individual">Individual</option><option value="team">Team</option><option value="group">Group</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm focus:border-tc-primary focus:outline-none">
                <option value="any">Any</option><option value="male">Male</option><option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fee (₹)" type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
            <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} placeholder="Unlimited" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm text-tc-muted">Enabled (open for registration)</span>
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default SportItemsManagerPage;
