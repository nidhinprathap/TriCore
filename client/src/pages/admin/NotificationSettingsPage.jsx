import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../api/adminContentApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Settings, CreditCard, Globe, Mail, Smartphone, MessageSquare } from 'lucide-react';

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-tc-primary' : 'bg-tc-border'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm focus:border-tc-primary focus:outline-none transition-colors"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const EMAIL_PROVIDERS = [
  { value: '', label: 'Select provider...' },
  { value: 'smtp', label: 'SMTP (Custom)' },
  { value: 'brevo', label: 'Brevo (Sendinblue)' },
  { value: 'sendgrid', label: 'SendGrid' },
  { value: 'mailgun', label: 'Mailgun' },
  { value: 'aws-ses', label: 'AWS SES' },
];

const SMS_PROVIDERS = [
  { value: '', label: 'Select provider...' },
  { value: 'twilio', label: 'Twilio' },
  { value: 'msg91', label: 'MSG91' },
  { value: 'textlocal', label: 'Textlocal' },
  { value: 'aws-sns', label: 'AWS SNS' },
];

const WHATSAPP_PROVIDERS = [
  { value: '', label: 'Select provider...' },
  { value: 'meta', label: 'Meta Cloud API' },
  { value: 'twilio', label: 'Twilio WhatsApp' },
  { value: 'gupshup', label: 'Gupshup' },
  { value: 'wati', label: 'WATI' },
];

const NotificationSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [integrations, setIntegrations] = useState({
    razorpay: { enabled: false, keyId: '', keySecret: '' },
    google: { enabled: false, clientId: '' },
    email: { enabled: false, provider: '', host: '', port: 587, user: '', pass: '', apiKey: '' },
    sms: { enabled: false, provider: '', accountSid: '', authToken: '', apiKey: '', senderId: '', from: '' },
    whatsapp: { enabled: false, provider: '', apiKey: '', authToken: '', phoneNumberId: '', accountSid: '', from: '' },
  });

  useEffect(() => {
    getSettings()
      .then((res) => {
        if (res.data.integrations) {
          setIntegrations((prev) => {
            const merged = { ...prev };
            Object.keys(prev).forEach((key) => {
              if (res.data.integrations[key]) {
                merged[key] = { ...prev[key], ...res.data.integrations[key] };
              }
            });
            return merged;
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (channel, field, value) => {
    setIntegrations((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ integrations });
      alert('Integrations saved!');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-tc-dim">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3"><Settings size={24} className="text-tc-primary" /> Integrations</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save All'}</Button>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Razorpay */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-tc-primary" />
              <div>
                <h3 className="text-sm font-bold tracking-[2px] uppercase">Razorpay</h3>
                <p className="text-xs text-tc-dim mt-0.5">Payment gateway for registrations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.razorpay.enabled && integrations.razorpay.keyId && <Badge variant="green">Active</Badge>}
              <Toggle enabled={integrations.razorpay.enabled} onToggle={() => update('razorpay', 'enabled', !integrations.razorpay.enabled)} />
            </div>
          </div>
          {integrations.razorpay.enabled && (
            <div className="space-y-4 pt-4 border-t border-tc-border">
              <Input label="Key ID" value={integrations.razorpay.keyId} onChange={(e) => update('razorpay', 'keyId', e.target.value)} placeholder="rzp_live_..." />
              <Input label="Key Secret" type="password" value={integrations.razorpay.keySecret} onChange={(e) => update('razorpay', 'keySecret', e.target.value)} placeholder="Your Razorpay secret" />
            </div>
          )}
        </Card>

        {/* Google OAuth */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-tc-primary" />
              <div>
                <h3 className="text-sm font-bold tracking-[2px] uppercase">Google OAuth</h3>
                <p className="text-xs text-tc-dim mt-0.5">Sign in with Google for participants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.google.enabled && integrations.google.clientId && <Badge variant="green">Active</Badge>}
              <Toggle enabled={integrations.google.enabled} onToggle={() => update('google', 'enabled', !integrations.google.enabled)} />
            </div>
          </div>
          {integrations.google.enabled && (
            <div className="space-y-4 pt-4 border-t border-tc-border">
              <Input label="Client ID" value={integrations.google.clientId} onChange={(e) => update('google', 'clientId', e.target.value)} placeholder="xxxx.apps.googleusercontent.com" />
            </div>
          )}
        </Card>

        {/* Email */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-tc-primary" />
              <div>
                <h3 className="text-sm font-bold tracking-[2px] uppercase">Email</h3>
                <p className="text-xs text-tc-dim mt-0.5">Registration confirmations & notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.email.enabled && integrations.email.provider && <Badge variant="green">Active</Badge>}
              <Toggle enabled={integrations.email.enabled} onToggle={() => update('email', 'enabled', !integrations.email.enabled)} />
            </div>
          </div>
          {integrations.email.enabled && (
            <div className="space-y-4 pt-4 border-t border-tc-border">
              <Select label="Provider" value={integrations.email.provider} onChange={(v) => update('email', 'provider', v)} options={EMAIL_PROVIDERS} />

              {integrations.email.provider === 'smtp' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="SMTP Host" value={integrations.email.host} onChange={(e) => update('email', 'host', e.target.value)} placeholder="smtp.gmail.com" />
                    <Input label="Port" value={integrations.email.port} onChange={(e) => update('email', 'port', e.target.value)} placeholder="587" />
                  </div>
                  <Input label="Username" value={integrations.email.user} onChange={(e) => update('email', 'user', e.target.value)} placeholder="your-email@gmail.com" />
                  <Input label="Password" type="password" value={integrations.email.pass} onChange={(e) => update('email', 'pass', e.target.value)} placeholder="App password" />
                </>
              )}

              {integrations.email.provider === 'brevo' && (
                <>
                  <Input label="API Key" value={integrations.email.apiKey} onChange={(e) => update('email', 'apiKey', e.target.value)} placeholder="xkeysib-..." />
                  <Input label="Sender Email" value={integrations.email.user} onChange={(e) => update('email', 'user', e.target.value)} placeholder="noreply@tricore.in" />
                </>
              )}

              {integrations.email.provider === 'sendgrid' && (
                <>
                  <Input label="API Key" value={integrations.email.apiKey} onChange={(e) => update('email', 'apiKey', e.target.value)} placeholder="SG...." />
                  <Input label="Sender Email" value={integrations.email.user} onChange={(e) => update('email', 'user', e.target.value)} placeholder="noreply@tricore.in" />
                </>
              )}

              {integrations.email.provider === 'mailgun' && (
                <>
                  <Input label="API Key" value={integrations.email.apiKey} onChange={(e) => update('email', 'apiKey', e.target.value)} placeholder="key-..." />
                  <Input label="Domain" value={integrations.email.host} onChange={(e) => update('email', 'host', e.target.value)} placeholder="mg.tricore.in" />
                  <Input label="Sender Email" value={integrations.email.user} onChange={(e) => update('email', 'user', e.target.value)} placeholder="noreply@tricore.in" />
                </>
              )}

              {integrations.email.provider === 'aws-ses' && (
                <>
                  <Input label="Access Key ID" value={integrations.email.apiKey} onChange={(e) => update('email', 'apiKey', e.target.value)} placeholder="AKIA..." />
                  <Input label="Secret Access Key" type="password" value={integrations.email.pass} onChange={(e) => update('email', 'pass', e.target.value)} />
                  <Input label="Region" value={integrations.email.host} onChange={(e) => update('email', 'host', e.target.value)} placeholder="ap-south-1" />
                  <Input label="Sender Email" value={integrations.email.user} onChange={(e) => update('email', 'user', e.target.value)} placeholder="noreply@tricore.in" />
                </>
              )}
            </div>
          )}
        </Card>

        {/* SMS */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-tc-primary" />
              <div>
                <h3 className="text-sm font-bold tracking-[2px] uppercase">SMS</h3>
                <p className="text-xs text-tc-dim mt-0.5">Event reminders & OTP verification</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.sms.enabled && integrations.sms.provider && <Badge variant="green">Active</Badge>}
              <Toggle enabled={integrations.sms.enabled} onToggle={() => update('sms', 'enabled', !integrations.sms.enabled)} />
            </div>
          </div>
          {integrations.sms.enabled && (
            <div className="space-y-4 pt-4 border-t border-tc-border">
              <Select label="Provider" value={integrations.sms.provider} onChange={(v) => update('sms', 'provider', v)} options={SMS_PROVIDERS} />

              {integrations.sms.provider === 'twilio' && (
                <>
                  <Input label="Account SID" value={integrations.sms.accountSid} onChange={(e) => update('sms', 'accountSid', e.target.value)} placeholder="AC..." />
                  <Input label="Auth Token" type="password" value={integrations.sms.authToken} onChange={(e) => update('sms', 'authToken', e.target.value)} />
                  <Input label="From Number" value={integrations.sms.from} onChange={(e) => update('sms', 'from', e.target.value)} placeholder="+1234567890" />
                </>
              )}

              {integrations.sms.provider === 'msg91' && (
                <>
                  <Input label="Auth Key" value={integrations.sms.apiKey} onChange={(e) => update('sms', 'apiKey', e.target.value)} placeholder="Auth key from MSG91 dashboard" />
                  <Input label="Sender ID" value={integrations.sms.senderId} onChange={(e) => update('sms', 'senderId', e.target.value)} placeholder="TRICOR" />
                  <Input label="Template ID" value={integrations.sms.from} onChange={(e) => update('sms', 'from', e.target.value)} placeholder="DLT template ID" />
                </>
              )}

              {integrations.sms.provider === 'textlocal' && (
                <>
                  <Input label="API Key" value={integrations.sms.apiKey} onChange={(e) => update('sms', 'apiKey', e.target.value)} />
                  <Input label="Sender Name" value={integrations.sms.senderId} onChange={(e) => update('sms', 'senderId', e.target.value)} placeholder="TRICOR" />
                </>
              )}

              {integrations.sms.provider === 'aws-sns' && (
                <>
                  <Input label="Access Key ID" value={integrations.sms.apiKey} onChange={(e) => update('sms', 'apiKey', e.target.value)} placeholder="AKIA..." />
                  <Input label="Secret Access Key" type="password" value={integrations.sms.authToken} onChange={(e) => update('sms', 'authToken', e.target.value)} />
                  <Input label="Region" value={integrations.sms.senderId} onChange={(e) => update('sms', 'senderId', e.target.value)} placeholder="ap-south-1" />
                </>
              )}
            </div>
          )}
        </Card>

        {/* WhatsApp */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-tc-primary" />
              <div>
                <h3 className="text-sm font-bold tracking-[2px] uppercase">WhatsApp</h3>
                <p className="text-xs text-tc-dim mt-0.5">WhatsApp Business API notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.whatsapp.enabled && integrations.whatsapp.provider && <Badge variant="green">Active</Badge>}
              <Toggle enabled={integrations.whatsapp.enabled} onToggle={() => update('whatsapp', 'enabled', !integrations.whatsapp.enabled)} />
            </div>
          </div>
          {integrations.whatsapp.enabled && (
            <div className="space-y-4 pt-4 border-t border-tc-border">
              <Select label="Provider" value={integrations.whatsapp.provider} onChange={(v) => update('whatsapp', 'provider', v)} options={WHATSAPP_PROVIDERS} />

              {integrations.whatsapp.provider === 'meta' && (
                <>
                  <Input label="Access Token" type="password" value={integrations.whatsapp.authToken} onChange={(e) => update('whatsapp', 'authToken', e.target.value)} placeholder="Permanent token from Meta" />
                  <Input label="Phone Number ID" value={integrations.whatsapp.phoneNumberId} onChange={(e) => update('whatsapp', 'phoneNumberId', e.target.value)} placeholder="From WhatsApp Business" />
                </>
              )}

              {integrations.whatsapp.provider === 'twilio' && (
                <>
                  <Input label="Account SID" value={integrations.whatsapp.accountSid} onChange={(e) => update('whatsapp', 'accountSid', e.target.value)} placeholder="AC..." />
                  <Input label="Auth Token" type="password" value={integrations.whatsapp.authToken} onChange={(e) => update('whatsapp', 'authToken', e.target.value)} />
                  <Input label="From Number" value={integrations.whatsapp.from} onChange={(e) => update('whatsapp', 'from', e.target.value)} placeholder="whatsapp:+14155238886" />
                </>
              )}

              {integrations.whatsapp.provider === 'gupshup' && (
                <>
                  <Input label="API Key" value={integrations.whatsapp.apiKey} onChange={(e) => update('whatsapp', 'apiKey', e.target.value)} />
                  <Input label="App Name" value={integrations.whatsapp.from} onChange={(e) => update('whatsapp', 'from', e.target.value)} placeholder="TriCoreEvents" />
                </>
              )}

              {integrations.whatsapp.provider === 'wati' && (
                <>
                  <Input label="API Endpoint" value={integrations.whatsapp.apiKey} onChange={(e) => update('whatsapp', 'apiKey', e.target.value)} placeholder="https://live-server-xxxx.wati.io" />
                  <Input label="Auth Token" type="password" value={integrations.whatsapp.authToken} onChange={(e) => update('whatsapp', 'authToken', e.target.value)} />
                </>
              )}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default NotificationSettingsPage;
