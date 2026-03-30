import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getAdminEvents, getAdminRegistrations } from '../../api/eventsApi.js';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color = 'var(--color-primary)' }) => (
  <Card className="flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-tc-dim tracking-[1px] uppercase">{label}</p>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, registrations: 0, revenue: 0 });
  const [recentRegs, setRecentRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminEvents({ limit: 1 }),
      getAdminRegistrations({ limit: 5 }),
    ]).then(([eventsRes, regsRes]) => {
      setStats({
        events: eventsRes.data.total,
        registrations: regsRes.data.total,
        revenue: 0,
      });
      setRecentRegs(regsRes.data.registrations);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-24" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Calendar} label="Total Events" value={stats.events} />
        <StatCard icon={Users} label="Registrations" value={stats.registrations} color="#4CAF50" />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="#2196F3" />
        <StatCard icon={TrendingUp} label="Active Events" value="—" color="#FF9800" />
      </div>
      <h2 className="text-lg font-bold mb-4">Recent Registrations</h2>
      <div className="space-y-3">
        {recentRegs.map((reg) => (
          <Card key={reg._id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{reg.user?.name}</p>
              <p className="text-xs text-tc-dim">{reg.event?.title} · {reg.sportItem?.name}</p>
            </div>
            <Badge variant={reg.status === 'approved' ? 'green' : reg.status === 'pending' ? 'yellow' : 'red'}>{reg.status}</Badge>
          </Card>
        ))}
        {recentRegs.length === 0 && <Card className="text-center py-8"><p className="text-tc-dim">No registrations yet</p></Card>}
      </div>
    </div>
  );
};

export default AdminDashboard;
