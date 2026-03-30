import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import ImageUpload from '../../ui/ImageUpload.jsx';
import { Plus, Trash2 } from 'lucide-react';

const TeamEditor = ({ data = {}, onChange }) => {
  const members = data.members || [];

  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, members: updated });
  };

  const addMember = () => onChange({ ...data, members: [...members, { name: '', role: '', photo: '' }] });
  const removeMember = (index) => onChange({ ...data, members: members.filter((_, i) => i !== index) });

  return (
    <div className="space-y-4">
      <Input label="Section Title" value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      {members.map((m, i) => (
        <div key={i} className="p-4 border border-tc-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tc-dim uppercase tracking-widest">Member {i + 1}</span>
            <button onClick={() => removeMember(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
          </div>
          <Input label="Name" value={m.name || ''} onChange={(e) => updateMember(i, 'name', e.target.value)} />
          <Input label="Role" value={m.role || ''} onChange={(e) => updateMember(i, 'role', e.target.value)} />
          <ImageUpload label="Photo" value={m.photo || ''} onChange={(url) => updateMember(i, 'photo', url)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addMember}><Plus size={14} /> Add Member</Button>
    </div>
  );
};

export default TeamEditor;
