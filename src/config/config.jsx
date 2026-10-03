// Values come from .env.development (npm run dev) and .env.production (npm run build)
export const base_url = import.meta.env.VITE_BASE_URL;
export const chat_url = import.meta.env.VITE_CHAT_URL;
export const location_url = import.meta.env.VITE_LOCATION_URL;

// storefront url — used to build th rider-scan link embedded in order label QR codes
export const site_url = import.meta.env.VITE_SITE_URL;
