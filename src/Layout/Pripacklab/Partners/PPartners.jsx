/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import { staffRequest, fetchPartnerDoc } from "./partnerAdminApi";

// Admin list for sellers and suppliers (kind = 'seller' | 'supplier'):
// filter by approval status, review NID + shop picture, approve / reject /
// suspend, set categories, chat, and add/edit/delete accounts.

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-slate-200 text-slate-700",
};
const FILTERS = ["all", "pending", "approved", "rejected", "suspended"];

const KIND = {
  seller: {
    title: "Sellers",
    singular: "Seller",
    endpoints: { list: "/sellers", add: "/addseller", edit: (id) => `/editseller/${id}`, del: (id) => `/delseller/${id}` },
    extraFields: [
      { name: "zilla", placeholder: "Zilla" },
      { name: "activetime", placeholder: "Active Time, e.g. 9 AM - 8 PM" },
      { name: "services", placeholder: "Services, comma separated", list: true },
    ],
    passwordRequired: true,
  },
  supplier: {
    title: "Suppliers",
    singular: "Supplier",
    endpoints: { list: "/suppliers", add: "/addsupplier", edit: (id) => `/editsupplier/${id}`, del: (id) => `/delsupplier/${id}` },
    extraFields: [{ name: "location", placeholder: "Location on map (link)" }],
    passwordRequired: false,
  },
};

const DocImage = ({ label, src }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">{label}</p>
    {src ? (
      <a href={src} target="_blank" rel="noreferrer">
        <img src={src} alt={label} className="w-full h-36 object-contain bg-gray-100 dark:bg-slate-800 rounded-lg" />
      </a>
    ) : (
      <div className="w-full h-36 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-400">Not uploaded</div>
    )}
  </div>
);

const PartnerReview = ({ kind, partner, allCategories, onClose, onChanged }) => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState({ nidFront: null, nidBack: null });
  const [docError, setDocError] = useState("");
  const [cats, setCats] = useState(partner.categories || []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const urls = [];
    [["nidFront", partner.hasNidFront], ["nidBack", partner.hasNidBack]].forEach(([which, has]) => {
      if (!has) return;
      fetchPartnerDoc(kind, partner._id, which)
        .then((url) => {
          urls.push(url);
          setDocs((prev) => ({ ...prev, [which]: url }));
        })
        .catch((err) => setDocError(err.message));
    });
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [kind, partner]);

  const setStatus = async (status) => {
    const { value: note, isConfirmed } = await Swal.fire({
      title: `Set ${kind} to "${status}"?`,
      input: "text",
      inputPlaceholder: `Note for the ${kind} (optional)`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });
    if (!isConfirmed) return;
    setBusy(true);
    try {
      await staffRequest(`/admin/${kind}s/${partner._id}/status`, { method: "PATCH", body: { status, note } });
      onChanged();
      onClose();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const saveCategories = async () => {
    setBusy(true);
    try {
      const data = await staffRequest(`/admin/${kind}s/${partner._id}/categories`, { method: "PUT", body: { categories: cats } });
      setCats(data.categories);
      onChanged();
      Swal.fire("Saved", "Categories updated.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const toggleCat = (name) => setCats((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-slate-400 hover:text-red-500 text-xl">✕</button>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold dark:text-slate-100">{partner.shopName || partner.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[partner.status]}`}>{partner.status}</span>
          {!partner.canLogin && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No login (set a password)</span>}
          <button onClick={() => navigate(`/pripacklab/partnerchat?type=${kind}&id=${partner._id}`)} className="btn btn-xs btn-outline ml-auto mr-6">Chat</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm dark:text-slate-300 mb-4">
          <p><b>Name:</b> {partner.name}</p>
          <p><b>Phone:</b> {partner.phone}</p>
          <p><b>Email:</b> {partner.email || "—"}</p>
          <p><b>District:</b> {partner.district || partner.zilla || "—"}</p>
          <p className="md:col-span-2"><b>Address:</b> {partner.address || "—"}</p>
          {partner.createdAt && <p><b>Signed up:</b> {new Date(partner.createdAt).toLocaleString()}</p>}
          {partner.statusNote && <p className="md:col-span-2"><b>Last note:</b> {partner.statusNote}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <DocImage label="NID front" src={docs.nidFront} />
          <DocImage label="NID back" src={docs.nidBack} />
          <DocImage label="Shop picture" src={partner.shopPic ? `${base_url}${partner.shopPic}` : null} />
        </div>
        {docError && <p className="text-xs text-red-500 mb-2">{docError}</p>}

        <div className="mt-4">
          <p className="text-sm font-semibold dark:text-slate-200 mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => (
              <label key={c._id} className={`text-xs px-2 py-1 rounded-full border cursor-pointer ${cats.includes(c.catname) ? "bg-cyan-500 text-white border-cyan-500" : "border-gray-300 dark:border-slate-600 dark:text-slate-300"}`}>
                <input type="checkbox" className="hidden" checked={cats.includes(c.catname)} onChange={() => toggleCat(c.catname)} />
                {c.catname}
              </label>
            ))}
          </div>
          <button onClick={saveCategories} disabled={busy} className="btn btn-xs mt-2">Save categories</button>
        </div>

        <div className="flex flex-wrap justify-end gap-2 mt-6 border-t pt-4 dark:border-slate-700">
          {partner.status !== "approved" && <button disabled={busy} onClick={() => setStatus("approved")} className="btn btn-sm btn-success">Approve</button>}
          {partner.status === "pending" && <button disabled={busy} onClick={() => setStatus("rejected")} className="btn btn-sm btn-error">Reject</button>}
          {partner.status === "approved" && <button disabled={busy} onClick={() => setStatus("suspended")} className="btn btn-sm btn-warning">Suspend</button>}
        </div>
      </div>
    </div>
  );
};

const PPartners = ({ kind }) => {
  const cfg = KIND[kind];
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [reviewing, setReviewing] = useState(null);

  const fetchPartners = () => {
    staffRequest(cfg.endpoints.list)
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .catch((error) => Swal.fire("Error", error.message, "error"));
  };

  useEffect(() => {
    setFilter("all");
    fetchPartners();
    fetch(`${base_url}/getcat`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const shown = useMemo(() => (filter === "all" ? partners : partners.filter((p) => p.status === filter)), [partners, filter]);
  const pendingCount = partners.filter((p) => p.status === "pending").length;

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This deletes the account and its NID images. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (!result.isConfirmed) return;
      staffRequest(cfg.endpoints.del(_id), { method: "DELETE" })
        .then((data) => {
          if (data.deletedCount > 0) {
            Swal.fire("Deleted!", `The ${kind} has been deleted.`, "success");
            setPartners((prev) => prev.filter((p) => p._id !== _id));
          } else {
            Swal.fire("Error!", "Nothing was deleted.", "error");
          }
        })
        .catch((error) => Swal.fire("Error!", error.message, "error"));
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const body = {
      name: form.name.value.trim(),
      shopName: form.shopName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
    };
    cfg.extraFields.forEach((f) => {
      const v = form[f.name].value.trim();
      body[f.name] = f.list ? v.split(",").map((s) => s.trim()).filter(Boolean) : v;
    });
    const password = form.password.value.trim();
    if (password) body.password = password;

    try {
      const data = await staffRequest(editing ? cfg.endpoints.edit(editing._id) : cfg.endpoints.add, {
        method: editing ? "PUT" : "POST",
        body,
      });
      if (editing) Swal.fire("Updated!", `${cfg.singular} updated.`, "success");
      else if (data.insertedId) Swal.fire("Added!", `${cfg.singular} added.`, "success");
      form.reset();
      closeForm();
      fetchPartners();
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  const fieldValue = (name) => {
    const v = editing?.[name];
    return Array.isArray(v) ? v.join(", ") : v || "";
  };

  return (
    <div className="w-full">
      <div className="hdr">{cfg.title}</div>

      <div className="relative px-6 py-4">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-xs capitalize ${filter === f ? "btn-info text-white" : "btn-ghost"}`}>
                {f}{f === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
              </button>
            ))}
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="smbut">+ Add New {cfg.singular}</button>
        </div>

        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Shop / Name</th>
                <th>Phone</th>
                <th>District</th>
                <th>Categories</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p._id} className="text-center border-b">
                  <td>
                    <p className="font-medium">{p.shopName || p.name}</p>
                    {p.shopName && <p className="text-xs text-gray-400">{p.name}</p>}
                  </td>
                  <td>{p.phone}</td>
                  <td>{p.district || p.zilla || "—"}</td>
                  <td className="truncate max-w-xs">{(p.categories || []).join(", ") || "—"}</td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setReviewing(p)} className="btn btn-xs btn-info text-white">Review</button>
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="btn btn-xs btn-warning">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-xs btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan="6" className="text-center py-4">No {cfg.title.toLowerCase()} found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {reviewing && (
          <PartnerReview kind={kind} partner={reviewing} allCategories={categories} onClose={() => setReviewing(null)} onChanged={fetchPartners} />
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-2xl relative">
              <button onClick={closeForm} className="absolute top-3 right-3 text-gray-500 dark:text-slate-400 hover:text-red-500 text-xl">✕</button>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-slate-100">{editing ? `Edit ${cfg.singular}` : `Add New ${cfg.singular}`}</h3>

              <form key={editing?._id || "new"} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" type="text" placeholder="Name" defaultValue={fieldValue("name")} className="priinput" required />
                <input name="shopName" type="text" placeholder="Shop / business name" defaultValue={fieldValue("shopName")} className="priinput" />
                <input name="email" type="email" placeholder="Email" defaultValue={fieldValue("email")} className="priinput" />
                <input name="phone" type="text" placeholder="Phone" defaultValue={fieldValue("phone")} className="priinput" required />
                <input
                  name="password"
                  type="password"
                  placeholder={editing ? "New password (optional)" : cfg.passwordRequired ? "Password" : "Password (optional, enables login)"}
                  className="priinput"
                  minLength={6}
                  required={!editing && cfg.passwordRequired}
                />
                {cfg.extraFields.map((f) => (
                  <input key={f.name} name={f.name} type="text" placeholder={f.placeholder} defaultValue={fieldValue(f.name)} className="priinput" />
                ))}
                <textarea name="address" placeholder="Address" defaultValue={fieldValue("address")} className="textarea textarea-bordered w-full md:col-span-2" />
                <p className="text-xs text-gray-400 md:col-span-2">Accounts added here start approved. Set categories with Review.</p>
                <button type="submit" className="pributton md:col-span-2">{editing ? "Update" : "Add"}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PPartners;
