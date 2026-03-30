import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPage, updateSection, addSection, deleteSection, reorderSections } from '../../api/adminContentApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { GripVertical, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import HeroEditor from '../../components/admin/editors/HeroEditor.jsx';
import ServicePillarsEditor from '../../components/admin/editors/ServicePillarsEditor.jsx';
import TrustPartnersEditor from '../../components/admin/editors/TrustPartnersEditor.jsx';
import FeaturedEventsEditor from '../../components/admin/editors/FeaturedEventsEditor.jsx';
import TestimonialsEditor from '../../components/admin/editors/TestimonialsEditor.jsx';
import FinalCtaEditor from '../../components/admin/editors/FinalCtaEditor.jsx';
import ContentBlockEditor from '../../components/admin/editors/ContentBlockEditor.jsx';
import TeamEditor from '../../components/admin/editors/TeamEditor.jsx';
import ContactFormEditor from '../../components/admin/editors/ContactFormEditor.jsx';
import FaqEditor from '../../components/admin/editors/FaqEditor.jsx';
import StatsGridEditor from '../../components/admin/editors/StatsGridEditor.jsx';

const sectionTypes = ['hero','service-pillars','trust-partners','featured-events','testimonials','final-cta','content-block','team','contact-form','faq','stats-grid'];

const editorMap = {
  'hero': HeroEditor,
  'service-pillars': ServicePillarsEditor,
  'trust-partners': TrustPartnersEditor,
  'featured-events': FeaturedEventsEditor,
  'testimonials': TestimonialsEditor,
  'final-cta': FinalCtaEditor,
  'content-block': ContentBlockEditor,
  'team': TeamEditor,
  'contact-form': ContactFormEditor,
  'faq': FaqEditor,
  'stats-grid': StatsGridEditor,
};

const PageEditorPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [addModal, setAddModal] = useState(false);
  const [newType, setNewType] = useState('content-block');
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const fetchPage = () => {
    setLoading(true);
    getPage(slug).then((res) => setPage(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPage(); }, [slug]);

  const handleSave = async () => {
    try {
      await updateSection(slug, editing._id, { data: editData });
      setEditing(null);
      fetchPage();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to save'); }
  };

  const handleToggle = async (section) => {
    try {
      await updateSection(slug, section._id, { enabled: !section.enabled });
      fetchPage();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to update'); }
  };

  const handleDelete = async (sectionId) => {
    if (!confirm('Delete this section?')) return;
    try {
      await deleteSection(slug, sectionId);
      fetchPage();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to delete'); }
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (index) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const sorted = [...(page?.sections || [])].sort((a, b) => a.order - b.order);
    const [moved] = sorted.splice(dragIndex, 1);
    sorted.splice(index, 0, moved);

    const order = sorted.map((s, i) => ({ id: s._id, order: i }));

    try {
      await reorderSections(slug, order);
      fetchPage();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to reorder');
    }

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleAdd = async () => {
    try {
      await addSection(slug, { type: newType, data: {}, enabled: true, order: (page?.sections?.length || 0) });
      setAddModal(false);
      fetchPage();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to add section'); }
  };

  if (loading) return <div className="space-y-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-16" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{page?.title || 'Page Editor'}</h1>
          <p className="text-sm text-tc-dim">/{slug}</p>
        </div>
        <Button size="sm" onClick={() => setAddModal(true)}><Plus size={14} /> Add Section</Button>
      </div>

      <div className="space-y-3">
        {[...(page?.sections || [])].sort((a, b) => a.order - b.order).map((section, index) => (
          <Card
            key={section._id}
            className={`flex items-center gap-4 ${dragOverIndex === index ? 'border-tc-primary' : ''} ${dragIndex === index ? 'opacity-50' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
          >
            <GripVertical size={16} className="text-tc-dim cursor-grab" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{section.type}</span>
                <Badge variant={section.enabled ? 'green' : 'default'}>{section.enabled ? 'Active' : 'Hidden'}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleToggle(section)} className="text-tc-dim hover:text-white p-1">
                {section.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => { setEditing(section); setEditData(section.data || {}); }} className="text-tc-dim hover:text-tc-primary p-1">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(section._id)} className="text-tc-dim hover:text-red-400 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Edit: ${editing?.type}`} className="max-w-2xl">
        {(() => {
          const Editor = editorMap[editing?.type];
          if (Editor) return <Editor data={editData} onChange={setEditData} />;
          return <Textarea value={JSON.stringify(editData, null, 2)} onChange={(e) => { try { setEditData(JSON.parse(e.target.value)); } catch {} }} className="font-mono text-xs min-h-[300px]" />;
        })()}
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSave}>Save</Button>
          <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </Modal>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Section">
        <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm mb-4">
          {sectionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <Button onClick={handleAdd} className="w-full">Add</Button>
      </Modal>
    </div>
  );
};

export default PageEditorPage;
