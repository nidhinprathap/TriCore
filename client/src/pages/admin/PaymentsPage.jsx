import { useState, useEffect } from 'react';
import { getAdminRegistrations } from '../../api/eventsApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const paymentVariant = { pending: 'yellow', completed: 'green', failed: 'red', refunded: 'default' };
const paymentFilters = ['all', 'pending', 'completed', 'failed', 'refunded'];

const PaymentsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, pending: 0, completed: 0, failed: 0 });

  const fetchData = () => {
    setLoading(true);
    getAdminRegistrations({ page, limit: 20 })
      .then((res) => {
        const regs = res.data.registrations;
        setRegistrations(regs);
        setTotal(res.data.total);

        // Calculate stats from all fetched data
        const totalRevenue = regs.filter((r) => r.payment?.status === 'completed').reduce((sum, r) => sum + (r.payment?.amount || 0), 0);
        const pending = regs.filter((r) => r.payment?.status === 'pending').length;
        const completed = regs.filter((r) => r.payment?.status === 'completed').length;
        const failed = regs.filter((r) => r.payment?.status === 'failed').length;
        setStats({ totalRevenue, pending, completed, failed });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const filtered = filter === 'all' ? registrations : registrations.filter((r) => r.payment?.status === filter);
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-3 mb-6"><DollarSign size={24} className="text-tc-primary" /> Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-tc-primary/10 flex items-center justify-center"><TrendingUp size={24} className="text-tc-primary" /></div>
          <div><p className="text-2xl font-extrabold">₹{stats.totalRevenue.toLocaleString()}</p><p className="text-xs text-tc-dim tracking-[1px] uppercase">Revenue</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center"><CheckCircle size={24} className="text-green-400" /></div>
          <div><p className="text-2xl font-extrabold">{stats.completed}</p><p className="text-xs text-tc-dim tracking-[1px] uppercase">Completed</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 flex items-center justify-center"><Clock size={24} className="text-yellow-400" /></div>
          <div><p className="text-2xl font-extrabold">{stats.pending}</p><p className="text-xs text-tc-dim tracking-[1px] uppercase">Pending</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center"><XCircle size={24} className="text-red-400" /></div>
          <div><p className="text-2xl font-extrabold">{stats.failed}</p><p className="text-xs text-tc-dim tracking-[1px] uppercase">Failed</p></div>
        </Card>
      </div>

      <div className="flex gap-2 mb-6">
        {paymentFilters.map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reg) => (
            <Card key={reg._id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{reg.user?.name} <span className="text-xs text-tc-dim font-normal">{reg.user?.email}</span></p>
                <p className="text-xs text-tc-muted mt-1">{reg.event?.title} · {reg.sportItem?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-tc-primary">₹{reg.payment?.amount || 0}</span>
                <Badge variant={paymentVariant[reg.payment?.status] || 'default'}>{reg.payment?.status || 'unknown'}</Badge>
                {reg.payment?.paidAt && (
                  <span className="text-xs text-tc-dim">{new Date(reg.payment.paidAt).toLocaleDateString()}</span>
                )}
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <Card className="text-center py-12"><p className="text-tc-dim">No payments found</p></Card>}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider ${page === i + 1 ? 'bg-tc-primary text-tc-bg' : 'border border-tc-border text-tc-muted hover:border-tc-primary'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
