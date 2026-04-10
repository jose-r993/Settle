import { useState } from 'react';

const ALL_NOTIFS = [
  {
    id: '1', type: 'tour', icon: 'calendar_month', color: 'text-primary bg-primary/10',
    title: 'Tour Confirmed',
    body: 'Your in-person tour at The McKenzie Luxury Highrise is confirmed for April 15 at 10:00 AM.',
    time: '20 min ago',
    actions: ['View Booking', 'Reschedule', 'Cancel Tour'],
    related: ['Tour Reminder — April 14, 2026', 'Agent Assigned — Jordan Lee'],
  },
  {
    id: '2', type: 'price', icon: 'trending_down', color: 'text-yellow-700 bg-yellow-50',
    title: 'Price Drop Alert',
    body: 'Loft 404 Apartments dropped from $1,550/mo to $1,450/mo. That\'s $100 off — act fast.',
    time: '2 hrs ago',
    actions: ['View Listing', 'Book Tour'],
    related: ['Saved on Jan 20, 2026', 'Previously viewed 3 times'],
  },
  {
    id: '3', type: 'alert', icon: 'verified', color: 'text-green-700 bg-green-50',
    title: 'New Match Found',
    body: 'Madera Broadway (Knox-Henderson) just listed — 79% compatibility with your preferences.',
    time: '5 hrs ago',
    actions: ['View Listing', 'Save to Favorites'],
    related: ['Matches: Budget ✓, Safety ✓, Commute ✓'],
  },
  {
    id: '4', type: 'tour', icon: 'event_repeat', color: 'text-primary bg-primary/10',
    title: 'Tour Rescheduled',
    body: 'Your agent rescheduled your Katy Trail Apartments tour to April 18 at 2:00 PM.',
    time: '1 day ago',
    actions: ['Confirm New Time', 'Cancel Tour'],
    related: ['Original time: April 16, 11:00 AM'],
  },
  {
    id: '5', type: 'alert', icon: 'notifications_active', color: 'text-tertiary bg-tertiary/10',
    title: 'Lease Deadline Approaching',
    body: 'The Alton Oak has only 2 units remaining. Your saved listing may not be available much longer.',
    time: '2 days ago',
    actions: ['View Listing', 'Book Tour'],
    related: [],
  },
  {
    id: '6', type: 'price', icon: 'trending_up', color: 'text-yellow-700 bg-yellow-50',
    title: 'Rent Increase Notice',
    body: 'Average rent in Downtown Dallas increased 3.2% this month. Your saved listings remain within budget.',
    time: '1 week ago',
    actions: ['View Neighborhood Trends'],
    related: [],
  },
];

const TABS = ['All', 'Tours', 'Prices', 'Alerts'];
const TAB_FILTER = { All: () => true, Tours: n => n.type === 'tour', Prices: n => n.type === 'price', Alerts: n => n.type === 'alert' };

export default function Notifications({ onNavigate }) {
  const [activeTab,    setActiveTab]    = useState('All');
  const [selectedId,   setSelectedId]   = useState('1');
  const [readIds,      setReadIds]       = useState(new Set(['5', '6']));

  const filtered  = ALL_NOTIFS.filter(TAB_FILTER[activeTab]);
  const selected  = ALL_NOTIFS.find(n => n.id === selectedId) ?? ALL_NOTIFS[0];
  const unreadCnt = ALL_NOTIFS.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => setReadIds(new Set(ALL_NOTIFS.map(n => n.id)));
  const markRead    = (id) => setReadIds(s => new Set([...s, id]));

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      {/* Header */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-2">Notifications</h1>
          <p className="text-xl text-on-surface-variant font-medium">{unreadCnt} unread</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={markAllRead} className="text-primary text-sm font-bold hover:underline">Mark all read</button>
          <button onClick={() => onNavigate('/settings')} className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-high rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Settings
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex bg-surface-container-high rounded-xl p-1 mb-8 w-fit gap-1">
        {TABS.map(tab => {
          const cnt = ALL_NOTIFS.filter(TAB_FILTER[tab]).filter(n => !readIds.has(n.id)).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all',
                activeTab === tab ? 'bg-surface-container-lowest text-on-surface editorial-shadow' : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {tab}
              {cnt > 0 && (
                <span className="bg-primary text-white text-[0.6rem] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{cnt}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left — notification list */}
        <div className="lg:col-span-5 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-outline mb-3 block">notifications_none</span>
              <p className="font-semibold">No notifications in this category</p>
            </div>
          ) : (
            filtered.map(n => (
              <button
                key={n.id}
                onClick={() => { setSelectedId(n.id); markRead(n.id); }}
                className={[
                  'w-full flex items-start gap-4 p-5 rounded-xl transition-all text-left',
                  selectedId === n.id ? 'bg-primary/5 ring-1 ring-primary/20' : 'bg-surface-container-low hover:bg-surface-container',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-on-surface leading-tight">{n.title}</p>
                    {!readIds.has(n.id) && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 line-clamp-2 leading-relaxed">{n.body}</p>
                  <p className="text-[0.65rem] text-outline font-medium mt-2">{n.time}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right — detail panel */}
        <div className="lg:col-span-7">
          {selected && (
            <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selected.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{selected.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface mb-1">{selected.title}</h2>
                  <p className="text-[0.75rem] text-outline font-medium">{selected.time}</p>
                </div>
              </div>

              <p className="text-on-surface-variant font-medium leading-relaxed mb-8">{selected.body}</p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                {selected.actions.map((action, i) => (
                  <button
                    key={action}
                    className={i === 0
                      ? 'bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95'
                      : 'bg-surface-container-high text-on-surface px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition active:scale-95'
                    }
                  >
                    {action}
                  </button>
                ))}
              </div>

              {/* Related activity */}
              {selected.related.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl p-5">
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-4">Related Activity</p>
                  <div className="space-y-3">
                    {selected.related.map(item => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline text-[16px]">subdirectory_arrow_right</span>
                        <p className="text-sm text-on-surface-variant font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
