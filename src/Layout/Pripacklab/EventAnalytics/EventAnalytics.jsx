import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FiBarChart2, FiExternalLink } from 'react-icons/fi';
import { base_url } from '../../../config/config';
import { AuthContext } from '../../Provider/Authprovider';
import { ThemeContext } from '../../Provider/ThemeProvider';

// The admin panel's look, handed to the embedded CC Events dashboard so it
// matches: indigo-600 accent, white / slate-900 surfaces.
const embedTheme = (mode) => ({
  mode,
  primary: '#4f46e5',
  bg: mode === 'dark' ? '#0f172a' : '#ffffff',
});

// Embeds the CC Events view-only analytics dashboard. The link comes from the
// API (staff token required) rather than the bundle, because the link itself
// grants access.
const EventAnalytics = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  // Theme at first load goes in the URL; later toggles are sent live so the
  // iframe doesn't reload.
  const [initialMode] = useState(theme);

  useEffect(() => {
    if (!token) return;
    fetch(`${base_url}/admin/eventsdashboardlink`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Could not load analytics');
        setUrl(data.url || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const src = useMemo(() => {
    if (!url) return null;
    const target = new URL(url);
    Object.entries(embedTheme(initialMode)).forEach(([key, value]) => target.searchParams.set(key, value));
    return target.toString();
  }, [url, initialMode]);

  useEffect(() => {
    if (!src || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'cc-events:theme', theme: embedTheme(theme) },
      new URL(src).origin
    );
  }, [theme, src]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <FiBarChart2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#121445] dark:text-slate-100">Event Analytics</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">Customer activity, popular products and categories</p>
          </div>
        </div>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-300"
          >
            <FiExternalLink className="w-3.5 h-3.5" /> Open in new tab
          </a>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md h-[calc(100vh-9rem)] min-h-[500px]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-indigo-600" />
          </div>
        ) : src ? (
          <iframe ref={iframeRef} src={src} title="Event Analytics" className="w-full h-full border-0" />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
            {error || 'Event analytics is not configured on the server.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAnalytics;
