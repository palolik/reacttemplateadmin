import { base_url } from "../../../config/config";

const staffToken = () => {
  try {
    return localStorage.getItem("authToken") || "";
  } catch {
    return "";
  }
};

// Staff-only endpoints. Resolves with the JSON body; rejects with an
// Error carrying the server's message (401 means the 1h staff token expired).
export async function staffRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`${base_url}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${staffToken()}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const err = new Error(
      res.status === 401 ? "Your admin session expired. Please log in again." : data.message || "Request failed."
    );
    err.status = res.status;
    throw err;
  }
  return data;
}

// NID images are private, so <img src> can't load them directly: fetch with
// the staff token and hand back an object URL for the image viewer.
// kind is 'seller' or 'supplier'.
export async function fetchPartnerDoc(kind, id, which) {
  const res = await fetch(`${base_url}/admin/${kind}s/${id}/doc/${which}`, {
    headers: { Authorization: `Bearer ${staffToken()}` },
  });
  if (!res.ok) throw new Error(res.status === 401 ? "Your admin session expired." : "Document not found.");
  return URL.createObjectURL(await res.blob());
}

export const taka = (n) => `৳ ${Number(n || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;

// Suppliers that can receive orders (approved), for transfer dropdowns.
export const fetchApprovedSuppliers = () =>
  staffRequest("/suppliers").then((list) => (Array.isArray(list) ? list.filter((s) => s.status === "approved") : []));

// Badge colors for the supplier's progress on a transferred order.
export const SUPPLIER_STATUS_BADGE = {
  Assigned: "bg-amber-100 text-amber-700",
  "In Production": "bg-sky-100 text-sky-700",
  "Pickup Requested": "bg-indigo-100 text-indigo-700",
  "Picked Up": "bg-green-100 text-green-700",
};
