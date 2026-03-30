import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminRegistrations, updateRegistrationStatus } from '../../api/eventsApi.js';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Check, X, Download } from 'lucide-react';
import axiosClient from '../../api/axiosClient.js';

const statusVariant = { pending: 'yellow', approved: 'green', rejected: 'red', waitlisted: 'blue', cancelled: 'default' };

const RegistrationsManagerPage = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRegs = () => {
    setLoading(true);
    getAdminRegistrations({ page, limit: 20 }).then((res) => { setRegistrations(res.data.registrations); setTotal(res.data.total); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRegs(); }, [page]);

  const handleStatus = async (id, status) => {
    try {
      await updateRegistrationStatus(id, status);
      fetchRegs();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed to update'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registrations</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-tc-dim">{total} total</span>
          <Button variant="secondary" size="sm" onClick={async () => {
            try {
              const res = await axiosClient.get('/admin/registrations/export', { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const a = document.createElement('a');
              a.href = url;
              a.download = 'registrations.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            } catch { alert('Export failed'); }
          }}><Download size={14} /> Export CSV</Button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <Card key={reg._id} className="flex items-center justify-between cursor-pointer" onClick={() => navigate(`/admin/registrations/${reg._id}`)}>
              <div>
                <p className="font-semibold">{reg.user?.name} <span className="text-xs text-tc-dim font-normal">{reg.user?.email}</span></p>
                <p className="text-sm text-tc-muted mt-1">{reg.event?.title} · {reg.sportItem?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[reg.status]}>{reg.status}</Badge>
                {reg.status === 'pending' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleStatus(reg._id, 'approved')} className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20"><Check size={14} /></button>
                    <button onClick={() => handleStatus(reg._id, 'rejected')} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20"><X size={14} /></button>
                  </div>
                )}
              </div>
            </Card>
          ))}
          {Math.ceil(total / 20) > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(total / 20) }).map((_, i) => (
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
      )}
    </div>
  );
};

export default RegistrationsManagerPage;
