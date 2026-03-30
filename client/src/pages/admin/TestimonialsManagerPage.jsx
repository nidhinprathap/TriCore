import { useState, useEffect } from 'react';
import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../api/eventsApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

const TestimonialsManagerPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', rating: 5, status: 'approved' });
  const [editId, setEditId] = useState(null);

  const fetch = () => { getAdminTestimonials().then((res) => setTestimonials(res.data.testimonials || res.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      if (editId) await updateTestimonial(editId, form);
      else await createTestimonial(form);
      setModal(false); setEditId(null); setForm({ name: '', role: '', company: '', content: '', rating: 5, status: 'approved' });
      fetch();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to save'); }
  };

  const handleEdit = (t) => { setForm({ name: t.name, role: t.role || '', company: t.company || '', content: t.content, rating: t.rating, status: t.status }); setEditId(t._id); setModal(true); };
  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await deleteTestimonial(id);
      fetch();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button size="sm" onClick={() => { setEditId(null); setForm({ name: '', role: '', company: '', content: '', rating: 5, status: 'approved' }); setModal(true); }}><Plus size={14} /> Add</Button>
      </div>
      <div className="space-y-3">
        {testimonials.map((t) => (
          <Card key={t._id} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{t.name}</p>
                <Badge variant={t.status === 'approved' ? 'green' : t.status === 'pending' ? 'yellow' : 'red'}>{t.status}</Badge>
              </div>
              <p className="text-sm text-tc-muted mt-1 line-clamp-1">"{t.content}"</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}><Edit size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(t._id)}><Trash2 size={14} className="text-red-400" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editId ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TestimonialsManagerPage;
