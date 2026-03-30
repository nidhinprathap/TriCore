import Input from '../../ui/Input.jsx';
import Textarea from '../../ui/Textarea.jsx';
import Button from '../../ui/Button.jsx';
import { Plus, Trash2 } from 'lucide-react';

const FaqEditor = ({ data = {}, onChange }) => {
  const items = data.items || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, items: updated });
  };

  const addItem = () => onChange({ ...data, items: [...items, { question: '', answer: '' }] });
  const removeItem = (index) => onChange({ ...data, items: items.filter((_, i) => i !== index) });

  return (
    <div className="space-y-4">
      <Input label="Section Title" value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      {items.map((item, i) => (
        <div key={i} className="p-4 border border-tc-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tc-dim uppercase tracking-widest">Question {i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
          </div>
          <Input label="Question" value={item.question || ''} onChange={(e) => updateItem(i, 'question', e.target.value)} />
          <Textarea label="Answer" value={item.answer || ''} onChange={(e) => updateItem(i, 'answer', e.target.value)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addItem}><Plus size={14} /> Add Question</Button>
    </div>
  );
};

export default FaqEditor;
