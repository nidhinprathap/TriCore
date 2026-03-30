import Input from '../../ui/Input.jsx';
import Textarea from '../../ui/Textarea.jsx';
import ImageUpload from '../../ui/ImageUpload.jsx';

const HeroEditor = ({ data = {}, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <Input label="Headline" value={data.headline || ''} onChange={(e) => update('headline', e.target.value)} />
      <Textarea label="Subheadline" value={data.subheadline || ''} onChange={(e) => update('subheadline', e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="CTA Label" value={data.ctaLabel || ''} onChange={(e) => update('ctaLabel', e.target.value)} />
        <Input label="CTA Link" value={data.ctaHref || ''} onChange={(e) => update('ctaHref', e.target.value)} />
      </div>
      <ImageUpload label="Background Image" value={data.backgroundImage || ''} onChange={(url) => update('backgroundImage', url)} />
    </div>
  );
};

export default HeroEditor;
