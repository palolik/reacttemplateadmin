import { useState, useEffect } from "react";
import { base_url } from "../../../config/config";
import Swal from "sweetalert2";
import RichTextEditor from "../../../utils/PichTextEditor";

const PRESET_CRITERIA = ["Size", "Cut", "Color", "Material", "Quantity", "Weight"];

const toImageUrl = (path) => {
    if (!path) return null;
    const match = path.replace(/\\/g, "/").match(/(\/uploads\/.+)/);
    return match ? `${base_url}${match[1]}` : `${base_url}/${path}`;
};

const EditProductDrawer = ({ p, onClose, onSaved }) => {
    // ── Basic fields ──────────────────────────────────────────────────────────
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filteredSubs, setFilteredSubs] = useState([]);

    const [form, setForm] = useState({
        category:           p.category           || "",
        subCategory:        p.subCategory        || "",
        productName:        p.productName        || "",
        productDescription: p.productDescription || "",
        productSupplier:    p.productSupplier    || "",
        deliveryTime:       p.deliveryTime       || "",
    });

    // ── Images ────────────────────────────────────────────────────────────────
    const [existingPics, setExistingPics] = useState(p.mainPics || []); // kept server paths
    const [newImages,    setNewImages]    = useState([]);                // new File objects

    // ── Tags ──────────────────────────────────────────────────────────────────
    const [tags,     setTags]     = useState(p.tags || []);
    const [tagInput, setTagInput] = useState("");

    // ── Criteria ──────────────────────────────────────────────────────────────
    const [criteria,          setCriteria]          = useState(p.criteria || []);
    const [selectedCriteria,  setSelectedCriteria]  = useState("");
    const [customCriteriaName,setCustomCriteriaName]= useState("");
    const [valueInputs,       setValueInputs]       = useState({});

    // ── Variants ──────────────────────────────────────────────────────────────
    const [variants, setVariants] = useState(p.variants || []);

    const [saving, setSaving] = useState(false);

    // ── Fetch categories ──────────────────────────────────────────────────────
    useEffect(() => {
        fetch(`${base_url}/getcatnsub`)
            .then(r => r.json())
            .then(d => { setCategories(d.categories); setSubcategories(d.subcategories); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (form.category) {
            setFilteredSubs(subcategories.filter(
                s => s.catname.toLowerCase() === form.category.toLowerCase()
            ));
        } else {
            setFilteredSubs([]);
        }
    }, [form.category, subcategories]);

    // ── Criteria helpers ──────────────────────────────────────────────────────
    const handleAddCriteria = () => {
        const name = selectedCriteria === "Custom" ? customCriteriaName.trim() : selectedCriteria;
        if (!name || criteria.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
        setCriteria(prev => [...prev, { name, values: [] }]);
        setSelectedCriteria(""); setCustomCriteriaName("");
    };

    const handleRemoveCriteria = (name) => {
        setCriteria(prev => prev.filter(c => c.name !== name));
        setValueInputs(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleAddValue = (criteriaName) => {
        const val = (valueInputs[criteriaName] || "").trim();
        if (!val) return;
        setCriteria(prev => prev.map(c =>
            c.name === criteriaName && !c.values.includes(val)
                ? { ...c, values: [...c.values, val] }
                : c
        ));
        setValueInputs(prev => ({ ...prev, [criteriaName]: "" }));
        setVariants([]); // force re-generate
    };

    const handleRemoveValue = (criteriaName, val) => {
        setCriteria(prev => prev.map(c =>
            c.name === criteriaName ? { ...c, values: c.values.filter(v => v !== val) } : c
        ));
        setVariants([]);
    };

    // ── Generate variants ─────────────────────────────────────────────────────
    const generateVariants = () => {
        const active = criteria.filter(c => c.values.length > 0);
        if (!active.length) return;

        let combinations = [{}];
        active.forEach(({ name, values }) => {
            combinations = combinations.flatMap(combo =>
                values.map(val => ({ ...combo, [name]: val }))
            );
        });

        // Keep prices from existing variants where combination matches
        const existingMap = {};
        variants.forEach(v => { existingMap[v.label] = v; });

        setVariants(combinations.map((combo, i) => {
            const label = Object.values(combo).join(" / ");
            const existing = existingMap[label];
            return {
                id:          existing?.id          || `var_${Date.now()}_${i}`,
                combination: combo,
                label,
                price:       existing?.price       || "",
                profit:      existing?.profit      || "",
                discount:    existing?.discount    || "",
                is_active:   existing?.is_active   ?? true,
            };
        }));
    };

    // ── Variant field update ──────────────────────────────────────────────────
    const handleVariantChange = (id, field, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const toggleVariantActive = (id) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, is_active: !v.is_active } : v));
    };

    // ── Image helpers ─────────────────────────────────────────────────────────
    const handleNewImages = (e) => {
        setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
    };

    const removeExistingPic = (path) => {
        setExistingPics(prev => prev.filter(p => p !== path));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    // ── Tag helpers ───────────────────────────────────────────────────────────
    const handleAddTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); setTagInput(""); }
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append("category",           form.category);
        formData.append("subCategory",        form.subCategory);
        formData.append("productName",        form.productName);
        formData.append("productDescription", form.productDescription);
        formData.append("productSupplier",    form.productSupplier);
        formData.append("deliveryTime",       form.deliveryTime);
        formData.append("tags",              JSON.stringify(tags));
        formData.append("criteria",          JSON.stringify(criteria));
        formData.append("variants",          JSON.stringify(variants));
        formData.append("existingPics",      JSON.stringify(existingPics));
        newImages.forEach(f => formData.append("mainPics", f));

        try {
            const res = await fetch(`${base_url}/editproduct/${p._id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                Swal.fire({ title: "Saved!", text: "Product updated successfully.", icon: "success" });
                onSaved();
                onClose();
            } else {
                alert("Failed to update product");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const availablePresets = PRESET_CRITERIA.filter(p => !criteria.find(c => c.name === p));

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[900px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-base">Edit Product</p>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-light leading-none">×</button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

                    {/* ── Basic Info ── */}
                    <section className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Basic Info</p>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">Category</span>
                                <select className="flinselect" value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}>
                                    <option value="">Select</option>
                                    {categories.map(c => <option key={c._id} value={c.catname}>{c.catname}</option>)}
                                </select>
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">Subcategory</span>
                                <select className="flinselect" value={form.subCategory}
                                    disabled={!form.category}
                                    onChange={e => setForm({ ...form, subCategory: e.target.value })}>
                                    <option value="">Select</option>
                                    {filteredSubs.map(s => <option key={s._id} value={s.subcat}>{s.subcat}</option>)}
                                </select>
                            </label>
                        </div>

                        <label className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Product Name</span>
                            <input className="flin" value={form.productName}
                                onChange={e => setForm({ ...form, productName: e.target.value })} />
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">Supplier</span>
                                <input className="flin" value={form.productSupplier}
                                    onChange={e => setForm({ ...form, productSupplier: e.target.value })} />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">Delivery Time</span>
                                <input className="flin" value={form.deliveryTime}
                                    onChange={e => setForm({ ...form, deliveryTime: e.target.value })} />
                            </label>
                        </div>
                    </section>

                    {/* ── Tags ── */}
                    <section className="flex flex-col gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tags</p>
                        <div className="flex gap-2">
                            <input className="flin flex-1 text-sm" placeholder="Add tag" value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())} />
                            <button type="button" className="btn btn-sm" onClick={handleAddTag}>Add</button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    #{tag}
                                    <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                                        className="text-gray-400 hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* ── Images ── */}
                    <section className="flex flex-col gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Images</p>

                        <div className="flex flex-wrap gap-2">
                            {/* Existing server images */}
                            {existingPics.map((pic, i) => (
                                <div key={i} className="relative group w-20 h-20 border rounded-xl overflow-hidden">
                                    <img src={toImageUrl(pic)} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
                                    <button onClick={() => removeExistingPic(pic)}
                                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                                </div>
                            ))}
                            {/* New local images */}
                            {newImages.map((img, i) => (
                                <div key={i} className="relative group w-20 h-20 border border-blue-200 rounded-xl overflow-hidden">
                                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => removeNewImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                                    <span className="absolute bottom-0 left-0 right-0 bg-blue-500/70 text-white text-[9px] text-center py-0.5">new</span>
                                </div>
                            ))}
                            {/* Add more */}
                            <label className="w-20 h-20 border border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-400 text-xl">
                                +
                                <input type="file" multiple className="hidden" onChange={handleNewImages} />
                            </label>
                        </div>
                    </section>

                    {/* ── Criteria ── */}
                    <section className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Criteria</p>

                        <div className="flex gap-2">
                            <select className="flinselect flex-1" value={selectedCriteria}
                                onChange={e => setSelectedCriteria(e.target.value)}>
                                <option value="">Select criteria</option>
                                {availablePresets.map(p => <option key={p} value={p}>{p}</option>)}
                                <option value="Custom">+ Custom</option>
                            </select>
                            <button type="button" className="btn btn-sm" onClick={handleAddCriteria}>Add</button>
                        </div>
                        {selectedCriteria === "Custom" && (
                            <input className="flin" placeholder="Criteria name"
                                value={customCriteriaName}
                                onChange={e => setCustomCriteriaName(e.target.value)} />
                        )}

                        {criteria.map(c => (
                            <div key={c.name} className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">{c.name}</span>
                                    <button type="button" onClick={() => handleRemoveCriteria(c.name)}
                                        className="text-xs text-red-400 hover:text-red-600">Remove</button>
                                </div>
                                <div className="flex gap-2">
                                    <input className="flin flex-1 text-sm" placeholder={`Add ${c.name} value`}
                                        value={valueInputs[c.name] || ""}
                                        onChange={e => setValueInputs(prev => ({ ...prev, [c.name]: e.target.value }))}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddValue(c.name))} />
                                    <button type="button" className="btn btn-sm text-xs" onClick={() => handleAddValue(c.name)}>Add</button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {c.values.map(val => (
                                        <span key={val} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                            {val}
                                            <button type="button" onClick={() => handleRemoveValue(c.name, val)}
                                                className="text-gray-300 hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {criteria.some(c => c.values.length > 0) && (
                            <button type="button" onClick={generateVariants}
                                className="btn btn-sm w-full bg-blue-600 text-white hover:bg-blue-700 border-0">
                                ⚡ Re-generate Variants
                            </button>
                        )}
                    </section>

                    {/* ── Variants ── */}
                    {variants.length > 0 && (
                        <section className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Variants ({variants.length})
                                </p>
                                <span className="text-[10px] text-green-500 font-semibold">
                                    {variants.filter(v => v.is_active).length} active
                                </span>
                            </div>

                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <div className="grid gap-2 px-3 py-2 bg-gray-50 text-[10px] font-bold uppercase tracking-wide text-gray-400"
                                    style={{ gridTemplateColumns: "1fr 80px 80px 70px 50px" }}>
                                    <span>Combination</span><span>Price</span><span>Profit</span><span>Discount</span><span>Active</span>
                                </div>
                                {variants.map(v => (
                                    <div key={v.id}
                                        className={`grid gap-2 px-3 py-2 border-t border-gray-100 items-center ${!v.is_active ? "opacity-40" : ""}`}
                                        style={{ gridTemplateColumns: "1fr 80px 80px 70px 50px" }}>
                                        <div className="flex flex-wrap gap-1">
                                            {Object.values(v.combination).map((val, i) => (
                                                <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-700 font-medium">{val}</span>
                                            ))}
                                        </div>
                                        <input type="number" placeholder="0" className="flin text-xs px-2 py-1"
                                            value={v.price} onChange={e => handleVariantChange(v.id, "price", e.target.value)}
                                            disabled={!v.is_active} />
                                        <input type="number" placeholder="0" className="flin text-xs px-2 py-1"
                                            value={v.profit} onChange={e => handleVariantChange(v.id, "profit", e.target.value)}
                                            disabled={!v.is_active} />
                                        <input type="number" placeholder="0%" className="flin text-xs px-2 py-1"
                                            value={v.discount} onChange={e => handleVariantChange(v.id, "discount", e.target.value)}
                                            disabled={!v.is_active} />
                                        <button type="button" onClick={() => toggleVariantActive(v.id)}
                                            className={`w-10 h-5 rounded-full transition-colors relative ${v.is_active ? "bg-green-400" : "bg-gray-200"}`}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${v.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Description ── */}
                    <section className="flex flex-col gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</p>
                           <RichTextEditor
                            name="productDescription"
                            value={form.productDescription}
onChange={value => setForm({ ...form, productDescription: value })}
                            className="bg-white rounded-lg w-full h-56"
                        />
                     
                        <p className="text-[10px] text-gray-400">Note: rich text formatting will be preserved as-is.</p>
                    </section>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 text-sm py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex-1 text-sm py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditProductDrawer;