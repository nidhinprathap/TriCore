import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import { Plus, Trash2 } from 'lucide-react';

const StatsGridEditor = ({ data = {}, onChange }) => {
  const stats = data.stats || [];

  const updateStat = (index, field, value) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, stats: updated });
  };

  const addStat = () => onChange({ ...data, stats: [...stats, { value: '', label: '' }] });
  const removeStat = (index) => onChange({ ...data, stats: stats.filter((_, i) => i !== index) });

  return (
    <div className="space-y-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-4 border border-tc-border flex items-end gap-4">
          <Input label="Value" value={stat.value || ''} onChange={(e) => updateStat(i, 'value', e.target.value)} className="flex-1" placeholder="500+" />
          <Input label="Label" value={stat.label || ''} onChange={(e) => updateStat(i, 'label', e.target.value)} className="flex-1" placeholder="Events Hosted" />
          <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-300 pb-2"><Trash2 size={14} /></button>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addStat}><Plus size={14} /> Add Stat</Button>
    </div>
  );
};

export default StatsGridEditor;
