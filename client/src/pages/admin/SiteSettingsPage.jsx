import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../api/adminContentApi.js';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((res) => setSettings(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (path, value) => {
    setSettings((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) { if (!obj[keys[i]]) obj[keys[i]] = {}; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try { await updateSettings(settings); alert('Settings saved!'); }
    catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading || !settings) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save All'}</Button>
      </div>
      <div className="max-w-2xl space-y-6">
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Branding</h3>
          <div className="space-y-4">
            <Input label="Site Name" value={settings.branding?.siteName || ''} onChange={(e) => update('branding.siteName', e.target.value)} />
            <Input label="Tagline" value={settings.branding?.tagline || ''} onChange={(e) => update('branding.tagline', e.target.value)} />
            <Input label="Logo URL" value={settings.branding?.logo?.url || ''} onChange={(e) => update('branding.logo.url', e.target.value)} />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Theme Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            {settings.theme?.colors && Object.entries(settings.theme.colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => update(`theme.colors.${key}`, e.target.value)}
                    className="w-10 h-10 border border-tc-border cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => update(`theme.colors.${key}`, e.target.value)}
                    className="flex-1 h-10 px-3 bg-tc-card border border-tc-border text-white text-sm font-mono focus:border-tc-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Contact</h3>
          <div className="space-y-4">
            <Input label="Email" value={settings.contact?.email || ''} onChange={(e) => update('contact.email', e.target.value)} />
            <Input label="Phone" value={settings.contact?.phone || ''} onChange={(e) => update('contact.phone', e.target.value)} />
            <Input label="WhatsApp" value={settings.contact?.whatsapp || ''} onChange={(e) => update('contact.whatsapp', e.target.value)} />
            <Textarea label="Address" value={settings.contact?.address || ''} onChange={(e) => update('contact.address', e.target.value)} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettingsPage;
