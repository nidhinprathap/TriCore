import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import ImageUpload from '../../ui/ImageUpload.jsx';
import { Plus, Trash2 } from 'lucide-react';

const TrustPartnersEditor = ({ data = {}, onChange }) => {
  const partners = data.partners || [];

  const updatePartner = (index, field, value) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, partners: updated });
  };

  const addPartner = () => onChange({ ...data, partners: [...partners, { name: '', logo: '' }] });
  const removePartner = (index) => onChange({ ...data, partners: partners.filter((_, i) => i !== index) });

  return (
    <div className="space-y-4">
      <Input label="Section Title" value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      {partners.map((p, i) => (
        <div key={i} className="p-4 border border-tc-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tc-dim uppercase tracking-widest">Partner {i + 1}</span>
            <button onClick={() => removePartner(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
          </div>
          <Input label="Name" value={p.name || ''} onChange={(e) => updatePartner(i, 'name', e.target.value)} />
          <ImageUpload label="Logo" value={p.logo || ''} onChange={(url) => updatePartner(i, 'logo', url)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addPartner}><Plus size={14} /> Add Partner</Button>
    </div>
  );
};

export default TrustPartnersEditor;
