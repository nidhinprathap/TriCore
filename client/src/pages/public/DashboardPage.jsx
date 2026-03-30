import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMyRegistrations } from '../../api/registrationApi.js';
import { initiatePayment, confirmPayment } from '../../api/paymentApi.js';
import SectionWrapper from '../../components/ui/SectionWrapper.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Calendar, Tag } from 'lucide-react';

const statusVariant = { pending: 'yellow', approved: 'green', rejected: 'red', waitlisted: 'blue', cancelled: 'default' };
const paymentVariant = { pending: 'yellow', completed: 'green', failed: 'red', refunded: 'default' };

const DashboardPage = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    getMyRegistrations().then((res) => setRegistrations(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handlePayNow = async (reg) => {
    setPayError('');
    try {
      const payRes = await initiatePayment(reg._id);
      const { orderId, amount, currency } = payRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'TriCore Events',
        description: `Registration: ${reg.sportItem?.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await confirmPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            // Refresh registrations after successful payment
            getMyRegistrations().then((res) => setRegistrations(res.data)).catch(() => {});
          } catch {
            setPayError('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#D4AF37' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPayError(err.response?.data?.error?.message || 'Could not initiate payment. Please try again.');
    }
  };

  return (
    <SectionWrapper>
      <h1 className="text-3xl font-extrabold mb-2">Dashboard</h1>
      <p className="text-tc-muted mb-10">Welcome, {user?.name}</p>
      <h2 className="text-xl font-bold mb-6">My Registrations</h2>
      {payError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm mb-6">{payError}</div>}
      {loading ? (
        <div className="space-y-4">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-24" />)}</div>
      ) : registrations.length === 0 ? (
        <Card className="text-center py-12"><p className="text-tc-dim">No registrations yet</p></Card>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <Card key={reg._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold">{reg.event?.title}</h3>
                <p className="text-sm text-tc-muted flex items-center gap-1.5 mt-1"><Tag size={12} />{reg.sportItem?.name} · {reg.type}</p>
                <p className="text-xs text-tc-dim flex items-center gap-1.5 mt-1"><Calendar size={12} />{new Date(reg.event?.dates?.start).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={statusVariant[reg.status]}>{reg.status}</Badge>
                {reg.payment && (
                  <Badge variant={paymentVariant[reg.payment.status] || 'default'}>
                    ₹{reg.payment.amount ?? 0} — {reg.payment.status || 'unknown'}
                  </Badge>
                )}
                {reg.payment?.status === 'pending' && reg.payment?.amount > 0 && (
                  <button
                    onClick={() => handlePayNow(reg)}
                    className="px-4 py-1.5 bg-tc-primary text-black text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default DashboardPage;
