import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiExternalLink } from 'react-icons/fi';
import { base_url } from '../../../config/config';
import { AuthContext } from '../../Provider/Authprovider';
import { ThemeContext } from '../../Provider/ThemeProvider';

// The admin panel's look, handed to embedded CC apps so they match:
// indigo-600 accent, white / slate-900 surfaces.
const embedTheme = (mode) => ({
  mode,
  primary: '#4f46e5',
  bg: mode === 'dark' ? '#0f172a' : '#ffffff',
});

// Embeds a CC app (CC Events dashboard, CC Delivery shop portal) by its
// static link. The link comes from the API (staff token required) rather
// than the bundle, because the link itself grants access.
//
//   linkPath     API path returning { url }
//   messageType  postMessage type the app listens on for live theme changes
const EmbeddedPortal = ({ title, subtitle, icon: Icon, linkPath, messageType, notConfigured }) => {
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
    fetch(`${base_url}${linkPath}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `Could not load ${title}`);
        setUrl(data.url || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, linkPath, title]);

  const src = useMemo(() => {
    if (!url) return null;
    try {
      const target = new URL(url);
      Object.entries(embedTheme(initialMode)).forEach(([key, value]) => target.searchParams.set(key, value));
      return target.toString();
    } catch {
      return null;
    }
  }, [url, initialMode]);

  useEffect(() => {
    if (!src || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: messageType, theme: embedTheme(theme) },
      new URL(src).origin
    );
  }, [theme, src, messageType]);

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <Icon className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#121445] dark:text-slate-100">{title}</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
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
          <iframe ref={iframeRef} src={src} title={title} className="w-full h-full border-0" />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
            {error || notConfigured}
          </div>
        )}
      </div>
    </div>
  );
};

EmbeddedPortal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  linkPath: PropTypes.string.isRequired,
  messageType: PropTypes.string.isRequired,
  notConfigured: PropTypes.string.isRequired,
};

export default EmbeddedPortal;
