import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../ui/Logo.jsx';
import {
  LayoutDashboard, FileText, MessageSquare, Image, Calendar, CalendarDays,
  ClipboardList, CreditCard, TrendingUp, Settings, Users, Bell, HardDrive,
  LogOut, Menu
} from 'lucide-react';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
      { label: 'Media Library', href: '/admin/media', icon: Image },
    ],
  },
  {
    label: 'EVENTS',
    items: [
      { label: 'Events', href: '/admin/events', icon: Calendar },
      { label: 'Calendar', href: '/admin/calendar', icon: CalendarDays },
      { label: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
      { label: 'Users & Roles', href: '/admin/users', icon: Users },
      { label: 'Integrations', href: '/admin/notifications', icon: Bell },
    ],
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-tc-bg text-white flex" style={{ fontFamily: 'var(--font-body)' }}>
      <aside className={`${collapsed ? 'w-16' : 'w-[260px]'} bg-tc-surface-alt border-r border-tc-border flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-tc-border">
          {collapsed ? (
            <Logo size="sm" showText={false} />
          ) : (
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <div>
                <div className="text-sm font-extrabold tracking-[3px]">TRICORE</div>
                <div className="text-[8px] font-semibold tracking-[2px] text-tc-primary">ADMIN</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-3 pt-4 pb-2 first:pt-0">
                  <span className="text-[10px] font-bold tracking-[2px] text-tc-dim">{group.label}</span>
                </div>
              )}
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-3 px-3 h-9 mb-0.5 rounded text-[13px] transition-colors ${
                      active ? 'bg-tc-primary/10 text-tc-primary font-semibold' : 'text-tc-muted hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-tc-primary' : 'text-tc-dim'} />
                    {!collapsed && label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-tc-border">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-tc-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-tc-primary text-xs font-bold">{user?.name?.[0] || 'A'}</span>
            </div>
            {!collapsed && (
              <div>
                <p className="text-[13px] font-medium">{user?.name}</p>
                <p className="text-[11px] text-tc-dim">{user?.role?.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 h-9 text-[13px] text-tc-dim hover:text-red-400 w-full transition-colors rounded">
            <LogOut size={18} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-tc-border flex items-center justify-between px-8 flex-shrink-0">
          <button onClick={() => setCollapsed(!collapsed)} className="text-tc-dim hover:text-white">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-tc-muted">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
