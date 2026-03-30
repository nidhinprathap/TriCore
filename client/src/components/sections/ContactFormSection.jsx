import { useState } from 'react';
import axiosClient from '../../api/axiosClient.js';
import SectionWrapper from '../ui/SectionWrapper.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Button from '../ui/Button.jsx';

const ContactFormSection = ({ data }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosClient.post('/contact', form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionWrapper>
      <div className="max-w-xl mx-auto">
        {sent ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
            <p className="text-tc-muted">Your message has been received. We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">{error}</div>}
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Textarea label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
          </form>
        )}
      </div>
    </SectionWrapper>
  );
};

export default ContactFormSection;
