import { useState, useEffect } from 'react';
import { useAuth } from '../context/SupabaseAuthContext';
import { supabase } from '../config/supabase';

const CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water_drop' },
  { id: 'electrical', label: 'Electrical', icon: 'bolt' },
  { id: 'hvac', label: 'HVAC', icon: 'mode_fan' },
  { id: 'appliance', label: 'Appliance', icon: 'kitchen' },
  { id: 'structural', label: 'Structural', icon: 'home' },
  { id: 'painting', label: 'Painting', icon: 'format_paint' },
  { id: 'locks', label: 'Locks/Doors', icon: 'lock' },
  { id: 'internet', label: 'Internet', icon: 'wifi_off' },
  { id: 'pest', label: 'Pest Control', icon: 'bug_report' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', desc: 'Can wait', color: 'text-on-surface-variant bg-surface-container' },
  { value: 'medium', label: 'Medium', desc: 'Within a week', color: 'text-primary bg-primary/10 ring-2 ring-primary/30' },
  { value: 'high', label: 'High', desc: 'Urgent', color: 'text-error bg-error/10 ring-2 ring-error/30' },
];

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const STATUS_CONFIG = {
  'pending': { label: 'Pending', color: 'bg-yellow-50 text-yellow-700', icon: 'schedule' },
  'in_progress': { label: 'In Progress', color: 'bg-primary/10 text-primary', icon: 'sync' },
  'completed': { label: 'Completed', color: 'bg-green-50 text-green-700', icon: 'check_circle' },
};

export default function Maintenance({ onNavigate }) {
  const { user } = useAuth();
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecentRequests();
    }
  }, [user]);

  const fetchRecentRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async () => {
    if (!category || !desc.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([{
          user_id: user.id,
          category: category,
          priority: priority,
          description: desc,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      setSubmitted(true);
      await fetchRecentRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface mb-3">Request Submitted</h1>
        <p className="text-on-surface-variant font-medium mb-2 text-center max-w-sm">
          Your {CATEGORIES.find(c => c.id === category)?.label} request has been submitted with <span className="font-bold capitalize">{priority}</span> priority.
        </p>
        <p className="text-sm text-outline mb-8">You'll receive updates in your Notifications.</p>
        <div className="flex gap-3">
          <button
            onClick={() => { setSubmitted(false); setDesc(''); setCategory(null); }}
            className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Submit Another
          </button>
          <button
            onClick={() => onNavigate('/notifications')}
            className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition active:scale-95"
          >
            View Notifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto w-full">

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Submit a Maintenance Request</h1>
        <p className="text-base text-on-surface-variant">Our AI-powered system will route your request to the right team and keep you updated on progress.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left — form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Category grid */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-on-surface mb-4">Issue Category</h2>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={[
                    'flex flex-col items-center gap-2 p-4 rounded-xl transition-all border-2',
                    category === id
                      ? 'bg-primary/5 border-primary'
                      : 'bg-white border-gray-200 hover:border-gray-300',
                  ].join(' ')}
                >
                  <span className={`material-symbols-outlined text-[28px] ${category === id ? 'text-primary' : 'text-on-surface-variant'}`}>{icon}</span>
                  <span className={`text-xs font-semibold text-center ${category === id ? 'text-on-surface' : 'text-on-surface-variant'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-on-surface mb-4">Priority Level</h2>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITIES.map(({ value, label, desc, color }) => (
                <button
                  key={value}
                  onClick={() => setPriority(value)}
                  className={[
                    'flex flex-col items-center justify-center p-4 rounded-xl transition-all text-center border-2',
                    priority === value ? `${color}` : 'bg-white border-gray-200 hover:border-gray-300',
                  ].join(' ')}
                >
                  <span className={`text-base font-bold mb-1`}>{label}</span>
                  <span className={`text-xs font-medium`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-on-surface mb-4">Describe the Issue</h2>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Please provide details about the issue you're experiencing..."
              rows={6}
              className="w-full bg-gray-50 rounded-lg px-4 py-3 text-on-surface placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all resize-none border border-gray-200"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!category || !desc.trim() || loading}
            className={[
              'w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2',
              category && desc.trim() && !loading
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Submit Request
              </>
            )}
          </button>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-1 space-y-6">

          {/* Recent requests */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-on-surface mb-4">Recent Requests</h3>
            <div className="space-y-3">
              {recentRequests.length > 0 ? (
                recentRequests.map(req => {
                  const statusInfo = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  const categoryInfo = CATEGORIES.find(c => c.id === req.category);
                  return (
                    <div key={req.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`material-symbols-outlined text-[18px] ${statusInfo.color.includes('green') ? 'text-green-600' : statusInfo.color.includes('primary') ? 'text-primary' : 'text-yellow-600'}`}>
                          {statusInfo.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-on-surface">#{req.id.slice(0, 4).toUpperCase()}</span>
                            <span className="text-xs text-on-surface-variant">{formatTimeAgo(req.created_at)}</span>
                          </div>
                          <p className="text-xs font-semibold text-on-surface capitalize mb-1">{categoryInfo?.label || req.category}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-2">{req.description}</p>
                          <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-on-surface-variant text-center py-4">No recent requests</p>
              )}
            </div>
          </div>

          {/* Emergency contact */}
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
            <div className="flex items-start gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span>
              <div>
                <h3 className="font-semibold text-sm text-on-surface mb-1">Emergency?</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  For urgent issues like gas leaks or flooding, call emergency maintenance:
                </p>
              </div>
            </div>
            <a href="tel:1-800-EMERGENCY" className="block w-full text-center bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition">
              1-800-EMERGENCY
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
