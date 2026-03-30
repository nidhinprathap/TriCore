import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getEvent, getEventItems } from '../../api/contentApi.js';
import { createRegistration } from '../../api/registrationApi.js';
import { initiatePayment, confirmPayment } from '../../api/paymentApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import SectionWrapper from '../../components/ui/SectionWrapper.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const eventSlug = searchParams.get('event');
  const itemId = searchParams.get('item');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({ teamName: '', teamMembers: [], notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (eventSlug) {
      getEvent(eventSlug).then((res) => setEvent(res.data)).catch(() => {});
      if (itemId) {
        getEventItems(eventSlug).then((res) => {
          const found = res.data.find((i) => i._id === itemId);
          if (found) setItem(found);
        }).catch(() => {});
      }
    }
  }, [eventSlug, itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const regRes = await createRegistration({ sportItemId: itemId, type: item?.type || 'individual', ...form });
      const registration = regRes.data;

      if (registration.payment?.amount > 0 && registration.payment?.status === 'pending') {
        const payRes = await initiatePayment(registration._id);
        const { orderId, amount, currency } = payRes.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: 'TriCore Events',
          description: `Registration: ${item?.name}`,
          order_id: orderId,
          handler: async (response) => {
            try {
              await confirmPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              setSuccess(true);
            } catch {
              setError('Payment verification failed. Contact support.');
            }
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: '#D4AF37' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  if (success) return (
    <SectionWrapper className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
        <p className="text-tc-muted mb-6">Check your dashboard for details.</p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    </SectionWrapper>
  );

  return (
    <SectionWrapper>
      <h1 className="text-3xl font-extrabold mb-2">Register</h1>
      {event && <p className="text-tc-muted mb-8">{event.title}{item ? ` — ${item.name}` : ''}</p>}
      <div className="max-w-lg">
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm mb-6">{error}</div>}
        <Card className="mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-tc-muted">Activity</span>
            <span className="font-semibold">{item?.name || '—'}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-tc-muted">Fee</span>
            <span className="font-semibold text-tc-primary">{item?.fee === 0 ? 'Free' : `₹${item?.fee}`}</span>
          </div>
        </Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {item?.type === 'team' && <Input label="Team Name" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} required />}
          <Input label="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Registering...' : 'Confirm Registration'}</Button>
        </form>
      </div>
    </SectionWrapper>
  );
};

export default RegisterPage;
