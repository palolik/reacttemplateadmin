import { jwtDecode } from "jwt-decode";
import { base_url } from "../config/config";

// Staff session for the whole admin panel:
//  - every request to the backend carries the current staff token,
//  - the token is renewed while someone is using the panel,
//  - an expired session (or a 401 from the backend) goes to the login page.
// The backend token lasts 1 hour, so a panel left idle that long logs out.

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";
const LOGIN_PATH = "/login";

const CHECK_EVERY_MS = 30 * 1000;      // how often expiry / renewal is checked
const RENEW_AFTER_MS = 5 * 60 * 1000;  // renew a token once it is this old...
const ACTIVE_WITHIN_MS = 5 * 60 * 1000; // ...if someone used the panel this recently

const nativeFetch = window.fetch.bind(window);
let lastActivity = Date.now();
let renewing = null;

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getStaffToken = () => read(TOKEN_KEY);

const claimsOf = (token) => {
  try {
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
};

// How far this computer's clock is ahead of the server's, measured from the
// token's issue time when it arrives. Without it a PC with a wrong clock would
// see every token as expired and loop back to the login page.
const SKEW_KEY = "authClockSkew";
const serverNow = () => Date.now() - (Number(read(SKEW_KEY)) || 0);

// Treat a token as expired a few seconds early so a request doesn't race the clock.
export const isTokenValid = (token) => {
  const claims = claimsOf(token);
  return Boolean(claims?.remail && claims.exp && claims.exp * 1000 > serverNow() + 5000);
};

export const saveStaffToken = (token) => {
  try {
    const claims = jwtDecode(token);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(claims));
    if (claims.iat) localStorage.setItem(SKEW_KEY, String(Date.now() - claims.iat * 1000));
  } catch {
    /* storage blocked: the session just won't survive a reload */
  }
};

export const clearStaffSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SKEW_KEY);
  } catch {
    /* ignore */
  }
};

const onLoginPage = () => window.location.pathname === LOGIN_PATH;

// Full page load to /login: drops every in-memory screen of the old session.
// `next` brings the person back to where they were after logging in again.
export const expireSession = ({ expired = true } = {}) => {
  clearStaffSession();
  if (onLoginPage()) return;
  const next = window.location.pathname + window.location.search;
  const params = new URLSearchParams({ next });
  if (expired) params.set("expired", "1");
  window.location.replace(`${LOGIN_PATH}?${params}`);
};

const isBackendUrl = (url) => Boolean(base_url) && url.startsWith(base_url);
const isLoginCall = (url) => url.split("?")[0] === `${base_url}/login`;

async function renew() {
  const token = getStaffToken();
  if (!isTokenValid(token)) return;
  const res = await nativeFetch(`${base_url}/auth/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) return expireSession();
  const data = await res.json().catch(() => ({}));
  if (res.ok && data.token) saveStaffToken(data.token);
}

function check() {
  if (onLoginPage()) return;
  const token = getStaffToken();
  if (!isTokenValid(token)) return expireSession();

  const issuedAt = (claimsOf(token).iat || 0) * 1000;
  const recentlyActive = Date.now() - lastActivity < ACTIVE_WITHIN_MS;
  if (recentlyActive && Date.now() - issuedAt > RENEW_AFTER_MS && !renewing) {
    // A failed renewal (network) is retried on the next check.
    renewing = renew().catch(() => {}).finally(() => { renewing = null; });
  }
}

let installed = false;

// Call once, before the router is created, so route loaders are covered too.
export function installStaffSession() {
  if (installed) return;
  installed = true;

  // Logged out or expired before anything loads: straight to the login page.
  if (!onLoginPage() && !isTokenValid(getStaffToken())) {
    expireSession({ expired: Boolean(getStaffToken()) });
  }

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!isBackendUrl(url) || isLoginCall(url)) return nativeFetch(input, init);

    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    const token = getStaffToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await nativeFetch(input, { ...init, headers });
    if (res.status === 401) expireSession();
    return res;
  };

  const markActive = () => { lastActivity = Date.now(); };
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach((event) =>
    window.addEventListener(event, markActive, { passive: true, capture: true })
  );
  let lastMove = 0;
  window.addEventListener("mousemove", () => {
    const now = Date.now();
    if (now - lastMove > 10000) { lastMove = now; markActive(); }
  }, { passive: true });

  // Coming back to the tab: check right away instead of waiting for the timer.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") check();
  });

  // Logged out in another tab: follow it.
  window.addEventListener("storage", (e) => {
    if (e.key === TOKEN_KEY && !e.newValue) expireSession({ expired: false });
  });

  setInterval(check, CHECK_EVERY_MS);
}
