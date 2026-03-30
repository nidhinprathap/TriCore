import Input from '../../ui/Input.jsx';

const FinalCtaEditor = ({ data = {}, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title || ''} onChange={(e) => update('title', e.target.value)} />
      <Input label="Subtitle" value={data.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="CTA Label" value={data.ctaLabel || ''} onChange={(e) => update('ctaLabel', e.target.value)} />
        <Input label="CTA Link" value={data.ctaHref || ''} onChange={(e) => update('ctaHref', e.target.value)} />
      </div>
    </div>
  );
};

export default FinalCtaEditor;
