import Input from '../../ui/Input.jsx';

const TestimonialsEditor = ({ data = {}, onChange }) => (
  <div className="space-y-4">
    <Input label="Section Title" value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
    <p className="text-xs text-tc-dim">Testimonials are managed in the Testimonials section of the admin panel. Approved testimonials appear here automatically.</p>
  </div>
);

export default TestimonialsEditor;
