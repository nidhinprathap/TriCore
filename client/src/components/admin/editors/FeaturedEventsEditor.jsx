import Input from '../../ui/Input.jsx';

const FeaturedEventsEditor = ({ data = {}, onChange }) => (
  <div className="space-y-4">
    <Input label="Section Title" value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
    <p className="text-xs text-tc-dim">Events are automatically pulled from published events. Mark events as "featured" in the Events Manager to control which appear here.</p>
  </div>
);

export default FeaturedEventsEditor;
