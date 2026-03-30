import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Plus, Edit, UserCheck, UserX, Users } from 'lucide-react';

const ROLES = ['admin', 'event_manager', 'sports_coordinator', 'registration_manager', 'finance', 'content_editor'];
const roleBadge = { admin: 'gold', event_manager: 'green', sports_coordinator: 'blue', registration_manager: 'yellow', finance: 'default', content_editor: 'default' };

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'content_editor' });
  const [editId, setEditId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async () => {
    try {
      if (editId) {
        await axiosClient.put(`/admin/users/${editId}`, { name: form.name, role: form.role });
      } else {
        await axiosClient.post('/admin/users', form);
      }
      setModal(false);
      setEditId(null);
      setForm({ name: '', email: '', password: '', role: 'content_editor' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to save');
    }
  };

  const handleEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditId(u._id);
    setModal(true);
  };

  const handleToggleActive = async (id, active) => {
    try {
      await axiosClient.patch(`/admin/users/${id}/active`, { active: !active });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3"><Users size={24} className="text-tc-primary" /> Users & Roles</h1>
        <Button size="sm" onClick={() => { setEditId(null); setForm({ name: '', email: '', password: '', role: 'content_editor' }); setModal(true); }}>
          <Plus size={14} /> Add User
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u._id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-tc-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-tc-primary font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{u.name}</p>
                    {!u.active && <Badge variant="red">Disabled</Badge>}
                  </div>
                  <p className="text-xs text-tc-dim">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={roleBadge[u.role] || 'default'}>{u.role?.replace('_', ' ')}</Badge>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(u)}><Edit size={14} /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleToggleActive(u._id, u.active)}>
                  {u.active ? <UserX size={14} className="text-red-400" /> : <UserCheck size={14} className="text-green-400" />}
                </Button>
              </div>
            </Card>
          ))}
          {users.length === 0 && <Card className="text-center py-12"><p className="text-tc-dim">No users found</p></Card>}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editId ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          {!editId && (
            <>
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </>
          )}
          <div>
            <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full h-10 px-3 bg-tc-card border border-tc-border text-white text-sm focus:border-tc-primary focus:outline-none"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
