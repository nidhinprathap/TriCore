import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateRegistrationStatus } from '../../api/eventsApi.js';
import axiosClient from '../../api/axiosClient.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { ArrowLeft, User, Calendar, Tag, CreditCard, Check, X } from 'lucide-react';

const statusVariant = { pending: 'yellow', approved: 'green', rejected: 'red', waitlisted: 'blue', cancelled: 'default' };
const paymentVariant = { pending: 'yellow', completed: 'green', failed: 'red', refunded: 'default' };

const RegistrationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reg, setReg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReg = async () => {
    try {
      const res = await axiosClient.get(`/admin/registrations?limit=200`);
      const found = res.data.registrations.find((r) => r._id === id);
      setReg(found || null);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchReg(); }, [id]);

  const handleStatus = async (status) => {
    try { await updateRegistrationStatus(id, status); fetchReg(); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
  };

  if (loading) return <Skeleton className="h-64" />;
  if (!reg) return <p className="text-tc-dim">Registration not found</p>;

  return (
    <div>
      <button onClick={() => navigate('/admin/registrations')} className="flex items-center gap-2 text-tc-muted hover:text-white text-sm mb-4"><ArrowLeft size={14} /> Back</button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registration Detail</h1>
        <Badge variant={statusVariant[reg.status]}>{reg.status}</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Participant</h3>
          <div className="flex items-center gap-3">
            <User size={16} className="text-tc-primary" />
            <div>
              <p className="font-semibold">{reg.user?.name}</p>
              <p className="text-xs text-tc-dim">{reg.user?.email}</p>
              {reg.user?.phone && <p className="text-xs text-tc-dim">{reg.user.phone}</p>}
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Event</h3>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-tc-primary" />
            <div>
              <p className="font-semibold">{reg.event?.title}</p>
              <p className="text-xs text-tc-dim flex items-center gap-1"><Tag size={10} /> {reg.sportItem?.name} · {reg.type}</p>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Payment</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-tc-muted">Amount</span><span className="font-bold text-tc-primary">₹{reg.payment?.amount || 0}</span></div>
            <div className="flex justify-between"><span className="text-sm text-tc-muted">Status</span><Badge variant={paymentVariant[reg.payment?.status]}>{reg.payment?.status || 'unknown'}</Badge></div>
            {reg.payment?.razorpayPaymentId && <div className="flex justify-between"><span className="text-sm text-tc-muted">Payment ID</span><span className="text-xs font-mono text-tc-dim">{reg.payment.razorpayPaymentId}</span></div>}
            {reg.payment?.paidAt && <div className="flex justify-between"><span className="text-sm text-tc-muted">Paid At</span><span className="text-xs text-tc-dim">{new Date(reg.payment.paidAt).toLocaleString()}</span></div>}
          </div>
        </Card>
        {reg.teamName && (
          <Card>
            <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">Team: {reg.teamName}</h3>
            {reg.teamMembers?.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-sm mb-2">
                <span className="text-tc-primary font-bold">{i + 1}.</span>
                <span>{m.name}</span>
                {m.email && <span className="text-tc-dim">{m.email}</span>}
                {m.role && <Badge variant="default">{m.role}</Badge>}
              </div>
            ))}
          </Card>
        )}
      </div>
      {reg.notes && <Card className="mt-6"><h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-2">Notes</h3><p className="text-sm text-tc-muted">{reg.notes}</p></Card>}
      {reg.status === 'pending' && (
        <div className="flex gap-3 mt-6">
          <Button onClick={() => handleStatus('approved')}><Check size={14} /> Approve</Button>
          <Button variant="secondary" onClick={() => handleStatus('rejected')}><X size={14} /> Reject</Button>
          <Button variant="secondary" onClick={() => handleStatus('waitlisted')}>Waitlist</Button>
        </div>
      )}
      <p className="mt-4 text-xs text-tc-dim">Registered: {new Date(reg.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default RegistrationDetailPage;
