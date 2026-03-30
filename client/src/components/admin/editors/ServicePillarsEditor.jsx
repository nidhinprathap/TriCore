import Input from '../../ui/Input.jsx';
import Textarea from '../../ui/Textarea.jsx';
import Button from '../../ui/Button.jsx';
import { Plus, Trash2 } from 'lucide-react';

const ServicePillarsEditor = ({ data = {}, onChange }) => {
  const pillars = data.pillars || [];

  const updateTitle = (value) => onChange({ ...data, title: value });

  const updatePillar = (index, field, value) => {
    const updated = [...pillars];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, pillars: updated });
  };

  const addPillar = () => onChange({ ...data, pillars: [...pillars, { icon: 'star', title: '', description: '' }] });

  const removePillar = (index) => onChange({ ...data, pillars: pillars.filter((_, i) => i !== index) });

  return (
    <div className="space-y-4">
      <Input label="Section Title" value={data.title || ''} onChange={(e) => updateTitle(e.target.value)} />
      {pillars.map((pillar, i) => (
        <div key={i} className="p-4 border border-tc-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tc-dim uppercase tracking-widest">Pillar {i + 1}</span>
            <button onClick={() => removePillar(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
          </div>
          <Input label="Icon" value={pillar.icon || ''} onChange={(e) => updatePillar(i, 'icon', e.target.value)} placeholder="trophy, building, users..." />
          <Input label="Title" value={pillar.title || ''} onChange={(e) => updatePillar(i, 'title', e.target.value)} />
          <Textarea label="Description" value={pillar.description || ''} onChange={(e) => updatePillar(i, 'description', e.target.value)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addPillar}><Plus size={14} /> Add Pillar</Button>
    </div>
  );
};

export default ServicePillarsEditor;
