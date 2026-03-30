import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminEvents, getCalendarFeeds } from '../../api/eventsApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const FEED_COLORS = {
  tricore: { bg: 'bg-tc-primary/10', text: 'text-tc-primary', dot: 'bg-tc-primary', label: 'TriCore Events' },
  holiday: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', label: 'Public Holidays' },
  ipl: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400', label: 'IPL 2026' },
  isl: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400', label: 'ISL 2025-26' },
  pkl: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'PKL 2026' },
  deadline: { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400', label: 'Reg. Deadlines' },
};

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [feeds, setFeeds] = useState({ holidays: [], sports: {} });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [showFeeds, setShowFeeds] = useState({
    tricore: true, holiday: true, ipl: true, isl: true, pkl: true, deadline: true,
  });
  const navigate = useNavigate();

  const year = date.getFullYear();
  const month = date.getMonth();

  const fetchAll = async () => {
    try {
      const [eventsRes, feedsRes] = await Promise.all([
        getAdminEvents({ limit: 200 }),
        getCalendarFeeds(),
      ]);
      setEvents(eventsRes.data.events);
      setFeeds(feedsRes.data);
      setLastSynced(new Date());
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    await fetchAll();
    setSyncing(false);
  };

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getEntriesForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cellDate = new Date(year, month, day);
    const entries = [];

    if (showFeeds.tricore) {
      events.forEach((e) => {
        const start = new Date(e.dates?.start);
        const end = e.dates?.end ? new Date(e.dates.end) : start;
        if (cellDate >= new Date(start.toDateString()) && cellDate <= new Date(end.toDateString())) {
          entries.push({ type: 'tricore', title: e.title, id: e._id, clickable: true });
        }
      });
    }

    if (showFeeds.deadline) {
      events.forEach((e) => {
        if (e.dates?.registrationDeadline && new Date(e.dates.registrationDeadline).toDateString() === cellDate.toDateString()) {
          entries.push({ type: 'deadline', title: `Deadline: ${e.title}` });
        }
      });
    }

    if (showFeeds.holiday) {
      feeds.holidays?.forEach((h) => {
        if (h.date === dateStr) entries.push({ type: 'holiday', title: h.name });
      });
    }

    Object.entries(feeds.sports || {}).forEach(([key, feed]) => {
      if (showFeeds[key]) {
        feed.events?.forEach((e) => {
          if (e.date === dateStr) entries.push({ type: key, title: e.title, venue: e.venue, time: e.time });
        });
      }
    });

    return entries;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const toggleFeed = (key) => setShowFeeds((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Calendar size={24} className="text-tc-primary" /> Smart Calendar
        </h1>
        <Button variant="secondary" size="sm" onClick={handleSync} disabled={syncing}>
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Feed toggles */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(FEED_COLORS).map(([key, { dot, label }]) => (
          <button
            key={key}
            onClick={() => toggleFeed(key)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-colors ${
              showFeeds[key] ? 'border-tc-border text-white' : 'border-tc-border/50 text-tc-dim opacity-50'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${dot}`}></span>
            {label}
          </button>
        ))}
      </div>

      {lastSynced && (
        <p className="text-[10px] text-tc-dim mb-4">Last synced: {lastSynced.toLocaleTimeString()}</p>
      )}

      <Card>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => setDate(new Date(year, month - 1, 1))}><ChevronLeft size={16} /></Button>
          <h2 className="text-lg font-bold">{MONTHS[month]} {year}</h2>
          <Button variant="ghost" size="sm" onClick={() => setDate(new Date(year, month + 1, 1))}><ChevronRight size={16} /></Button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-tc-border">
          {DAYS.map((d) => (
            <div key={d} className="bg-tc-bg p-2 text-center text-[10px] font-semibold tracking-[2px] uppercase text-tc-dim">{d}</div>
          ))}
          {cells.map((day, i) => {
            const entries = getEntriesForDay(day);
            return (
              <div
                key={i}
                className={`bg-tc-bg min-h-[110px] p-2 relative ${isToday(day) ? 'ring-1 ring-tc-primary ring-inset' : ''}`}
              >
                {day && (
                  <>
                    <span className={`text-xs font-medium ${isToday(day) ? 'text-tc-primary font-bold' : 'text-tc-muted'}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {entries.slice(0, 4).map((entry, j) => {
                        const colors = FEED_COLORS[entry.type] || FEED_COLORS.tricore;
                        return (
                          <button
                            key={j}
                            onClick={() => {
                              if (entry.clickable) navigate(`/admin/events/${entry.id}`);
                              else setTooltip(tooltip === `${i}-${j}` ? null : `${i}-${j}`);
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            className={`w-full text-left px-1 py-0.5 text-[9px] font-medium ${colors.bg} ${colors.text} truncate hover:opacity-80 transition-opacity relative`}
                          >
                            {entry.title}
                            {tooltip === `${i}-${j}` && !entry.clickable && (
                              <div className="absolute bottom-full left-0 mb-1 p-2 bg-tc-surface border border-tc-border text-white text-[10px] z-50 whitespace-nowrap shadow-lg">
                                <p className="font-bold">{entry.title}</p>
                                {entry.venue && <p className="text-tc-muted">{entry.venue}{entry.time ? ` · ${entry.time}` : ''}</p>}
                              </div>
                            )}
                          </button>
                        );
                      })}
                      {entries.length > 4 && (
                        <span className="text-[9px] text-tc-dim">+{entries.length - 4} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming this month */}
      <div className="mt-6">
        <h3 className="text-sm font-bold tracking-[2px] uppercase text-tc-dim mb-4">This Month</h3>
        <div className="space-y-2">
          {events
            .filter((e) => {
              const start = new Date(e.dates?.start);
              return start.getMonth() === month && start.getFullYear() === year;
            })
            .sort((a, b) => new Date(a.dates?.start) - new Date(b.dates?.start))
            .map((e) => (
              <Card key={e._id} className="flex items-center justify-between cursor-pointer hover:border-tc-primary/30" onClick={() => navigate(`/admin/events/${e._id}`)}>
                <div>
                  <p className="font-semibold text-sm">{e.title}</p>
                  <p className="text-xs text-tc-dim">{new Date(e.dates?.start).toLocaleDateString()}</p>
                </div>
                <Badge variant={e.status === 'published' ? 'green' : e.status === 'draft' ? 'default' : 'yellow'}>{e.status}</Badge>
              </Card>
            ))}

          {showFeeds.holiday && feeds.holidays
            ?.filter((h) => {
              const d = new Date(h.date);
              return d.getMonth() === month && d.getFullYear() === year;
            })
            .map((h, i) => (
              <Card key={`h-${i}`} className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0"></span>
                <div>
                  <p className="font-semibold text-sm text-red-400">{h.name}</p>
                  <p className="text-xs text-tc-dim">{new Date(h.date).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
