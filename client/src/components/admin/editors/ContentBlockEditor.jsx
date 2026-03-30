import Input from '../../ui/Input.jsx';
import Textarea from '../../ui/Textarea.jsx';
import ImageUpload from '../../ui/ImageUpload.jsx';

const ContentBlockEditor = ({ data = {}, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title || ''} onChange={(e) => update('title', e.target.value)} />
      <Textarea label="Body" value={data.body || ''} onChange={(e) => update('body', e.target.value)} className="min-h-[200px]" />
      <ImageUpload label="Image" value={data.image || ''} onChange={(url) => update('image', url)} />
    </div>
  );
};

export default ContentBlockEditor;
