/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import RichTextEditor from "../../../utils/PichTextEditor";
import { base_url } from "../../../config/config";

export const toImageUrl = (path) => {
  if (!path) return null;
  const match = path.replace(/\\/g, "/").match(/(\/uploads\/.+)/);
  return match ? `${base_url}${match[1]}` : `${base_url}/${path}`;
};

const activeVariants = (product) =>
  (product?.variants || []).filter((v) => v.is_active !== false && v.price !== "" && !isNaN(parseFloat(v.price)));

const money = (n) => `৳${(Math.round(n * 100) / 100).toLocaleString()}`;

const sectionLabel = "text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400";
const card = "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-4";
const fieldLabel = "text-sm text-gray-500 dark:text-slate-400";

// Drawer for creating (combo = null) or editing a combo package.
const ComboForm = ({ combo, products, onClose, onSaved }) => {
  const isEdit = Boolean(combo);

  const [form, setForm] = useState({
    title: combo?.title || "",
    titleBn: combo?.titleBn || "",
    startDate: combo?.startDate || "",
    endDate: combo?.endDate || "",
    totalCount: combo?.totalCount ?? "",
    comboPrice: combo?.comboPrice ?? "",
  });
  const [description, setDescription] = useState(combo?.description || "");
  const [descriptionBn, setDescriptionBn] = useState(combo?.descriptionBn || "");
  const [imageFile, setImageFile] = useState(null);
  const [items, setItems] = useState(
    (combo?.items || []).map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity || 1, snapshot: i }))
  );
  const [search, setSearch] = useState("");
  const [openProductId, setOpenProductId] = useState(null);
  const [saving, setSaving] = useState(false);

  // One object URL per picked file, revoked when it changes or the drawer closes.
  const filePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const previewUrl = filePreview || toImageUrl(combo?.image);

  const productsById = useMemo(
    () => Object.fromEntries(products.map((p) => [String(p._id), p])),
    [products]
  );

  // Current live details for each chosen item (price comes from the product's variant now).
  const rows = items.map((item) => {
    const product = productsById[item.productId];
    const variant = activeVariants(product).find((v) => v.id === item.variantId);
    return {
      ...item,
      product,
      variant,
      name: product?.productName || item.snapshot?.productName || "Unknown product",
      label: variant?.label || item.snapshot?.variantLabel || "",
      image: toImageUrl(product?.mainPics?.[0] || item.snapshot?.image),
      price: variant ? parseFloat(variant.price) : null,
    };
  });
  const hasUnavailable = rows.some((r) => r.price === null);
  const individualTotal = rows.reduce((sum, r) => sum + (r.price || 0) * r.quantity, 0);
  const comboPrice = parseFloat(form.comboPrice) || 0;
  const savings = individualTotal - comboPrice;

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        p.productName?.toLowerCase().includes(q) ||
        p.productNameBn?.includes(search.trim()) ||
        p.category?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, products]);

  const addItem = (product, variant) => {
    const productId = String(product._id);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variantId === variant.id);
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { productId, variantId: variant.id, quantity: 1 }];
    });
  };

  const updateQty = (index, value) => {
    const quantity = Math.max(1, Math.min(999, parseInt(value, 10) || 1));
    setItems((prev) => prev.map((i, idx) => (idx === index ? { ...i, quantity } : i)));
  };

  const removeItem = (index) => setItems((prev) => prev.filter((_, idx) => idx !== index));

  const handleSubmit = async () => {
    const problems = [];
    if (!form.title.trim()) problems.push("Title (English)");
    if (!form.startDate || !form.endDate) problems.push("Start and end date");
    if (form.totalCount === "" || Number(form.totalCount) < 0) problems.push("Total count");
    if (!comboPrice) problems.push("Combo price");
    if (!items.length) problems.push("At least one product");
    if (!isEdit && !imageFile) problems.push("Image");
    if (problems.length) {
      Swal.fire({ icon: "warning", title: "Missing information", text: problems.join(", ") });
      return;
    }
    if (form.startDate > form.endDate) {
      Swal.fire({ icon: "warning", title: "Check the dates", text: "End date must be on or after the start date." });
      return;
    }
    if (hasUnavailable) {
      Swal.fire({ icon: "warning", title: "Unavailable variant", text: "Remove the items marked unavailable before saving." });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, String(value).trim()));
    formData.append("description", description);
    formData.append("descriptionBn", descriptionBn);
    formData.append(
      "items",
      JSON.stringify(items.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })))
    );
    if (imageFile) formData.append("image", imageFile);

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `${base_url}/editcombo/${combo._id}` : `${base_url}/addcombo`, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not save combo");

      Swal.fire({ icon: "success", title: isEdit ? "Combo Updated!" : "Combo Created!", timer: 1500, showConfirmButton: false });
      onSaved();
      onClose();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Save failed", text: err.message });
    } finally {
      setSaving(false);
    }
  };


  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[900px] bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <div>
            <p className={sectionLabel}>{isEdit ? "Edit" : "New"}</p>
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">Combo Package</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50 dark:bg-slate-900">
          {/* Titles */}
          <div className={card}>
            <p className="font-medium text-gray-700 dark:text-slate-300">Title</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className={fieldLabel}>Title (English) *</span>
                <input type="text" className="flin" placeholder="e.g. Starter Packaging Combo"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={fieldLabel}>Title (Bangla)</span>
                <input type="text" className="flin" placeholder="বাংলায় কম্বোর নাম"
                  value={form.titleBn} onChange={(e) => setForm({ ...form, titleBn: e.target.value })} />
              </label>
            </div>
          </div>

          {/* Products */}
          <div className={card}>
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-700 dark:text-slate-300">Products in this combo *</p>
              <span className="text-xs text-gray-400">{items.length} selected</span>
            </div>

            <div className="relative">
              <input type="text" className="flin" placeholder="Search products by name or category..."
                value={search} onChange={(e) => { setSearch(e.target.value); setOpenProductId(null); }} />

              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 dark:border-slate-700 rounded-xl divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
                  {searchResults.map((p) => {
                    const variants = activeVariants(p);
                    const isOpen = openProductId === String(p._id);
                    return (
                      <div key={p._id}>
                        <button type="button" disabled={!variants.length}
                          onClick={() => setOpenProductId(isOpen ? null : String(p._id))}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-800/60 disabled:opacity-50 disabled:cursor-not-allowed">
                          {toImageUrl(p.mainPics?.[0]) ? (
                            <img src={toImageUrl(p.mainPics?.[0])} alt="" className="w-10 h-10 rounded object-cover" />
                          ) : <div className="w-10 h-10 rounded bg-gray-100 dark:bg-slate-800" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{p.productName}</p>
                            <p className="text-xs text-gray-400">{p.category}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {variants.length ? `${variants.length} variant${variants.length > 1 ? "s" : ""} ${isOpen ? "▴" : "▾"}` : "No priced variants"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="flex flex-wrap gap-2 px-3 pb-3 pt-1 bg-gray-50 dark:bg-slate-800/40">
                            {variants.map((v) => (
                              <button key={v.id} type="button" onClick={() => addItem(p, v)}
                                className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition">
                                + {v.label || "Default"} · ৳{v.price}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {search.trim() && searchResults.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">No products match “{search}”.</p>
              )}
            </div>

            {/* Chosen items */}
            {rows.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                Search above and click a variant to add it.
              </p>
            ) : (
              <div className="flex flex-col">
                <div className="grid gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide border-b border-gray-100 dark:border-slate-700 pb-2"
                  style={{ gridTemplateColumns: "1fr 90px 80px 100px 32px" }}>
                  <span>Product / Variant</span><span className="text-right">Unit price</span>
                  <span className="text-center">Qty</span><span className="text-right">Line total</span><span />
                </div>
                {rows.map((r, idx) => (
                  <div key={`${r.productId}-${r.variantId}`}
                    className="grid gap-2 items-center py-2 border-b border-gray-50 dark:border-slate-800"
                    style={{ gridTemplateColumns: "1fr 90px 80px 100px 32px" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      {r.image ? <img src={r.image} alt="" className="w-9 h-9 rounded object-cover" />
                        : <div className="w-9 h-9 rounded bg-gray-100 dark:bg-slate-800" />}
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 dark:text-slate-100 truncate">{r.name}</p>
                        <p className={`text-xs ${r.price === null ? "text-red-500" : "text-gray-400"}`}>
                          {r.label}{r.price === null && " — unavailable"}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-right text-gray-700 dark:text-slate-300">{r.price === null ? "—" : money(r.price)}</span>
                    <input type="number" min="1" max="999" className="input input-bordered input-xs w-full text-center"
                      value={r.quantity} onChange={(e) => updateQty(idx, e.target.value)} />
                    <span className="text-sm text-right font-medium text-gray-800 dark:text-slate-100">
                      {r.price === null ? "—" : money(r.price * r.quantity)}
                    </span>
                    <button type="button" onClick={() => removeItem(idx)} title="Remove"
                      className="text-gray-400 hover:text-red-500 text-center">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className={card}>
            <p className="font-medium text-gray-700 dark:text-slate-300">Pricing</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <span className={fieldLabel}>Individual prices total (auto)</span>
                <div className="h-8 px-3 flex items-center rounded-lg bg-gray-100 dark:bg-slate-800 text-sm font-semibold text-gray-700 dark:text-slate-200">
                  {money(individualTotal)}
                </div>
              </div>
              <label className="flex flex-col gap-1">
                <span className={fieldLabel}>Combo price (৳) *</span>
                <input type="number" min="0" step="0.01" className="flin" placeholder="0"
                  value={form.comboPrice} onChange={(e) => setForm({ ...form, comboPrice: e.target.value })} />
              </label>
              <div className="text-sm pb-1.5">
                {comboPrice > 0 && individualTotal > 0 && (
                  savings > 0 ? (
                    <span className="text-green-600 font-medium">
                      Customer saves {money(savings)} ({Math.round((savings / individualTotal) * 100)}%)
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">Combo price is not below the individual total</span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className={card}>
            <p className="font-medium text-gray-700 dark:text-slate-300">Availability</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col gap-1">
                <span className={fieldLabel}>Start date *</span>
                <input type="date" className="flin" value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={fieldLabel}>End date *</span>
                <input type="date" className="flin" value={form.endDate} min={form.startDate || undefined}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={fieldLabel}>Total count (stock) *</span>
                <input type="number" min={combo?.soldCount || 0} step="1" className="flin" placeholder="e.g. 50"
                  value={form.totalCount} onChange={(e) => setForm({ ...form, totalCount: e.target.value })} />
                {isEdit && combo.soldCount > 0 && (
                  <span className="text-xs text-gray-400">{combo.soldCount} already sold</span>
                )}
              </label>
            </div>
          </div>

          {/* Image */}
          <div className={card}>
            <p className="font-medium text-gray-700 dark:text-slate-300">Image {isEdit ? "" : "*"}</p>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Combo" className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-slate-700" />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs text-gray-400">No image</div>
              )}
              <label className="border border-dashed border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-slate-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/60">
                {imageFile ? imageFile.name : isEdit ? "Replace image" : "Choose image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className={card}>
            <p className="font-medium text-gray-700 dark:text-slate-300">Description (English)</p>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
          <div className={card}>
            <p className="font-medium text-gray-700 dark:text-slate-300">Description (Bangla)</p>
            <RichTextEditor value={descriptionBn} onChange={setDescriptionBn} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
          <button onClick={onClose}
            className="flex-1 text-sm py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 text-sm py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Combo"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ComboForm;
