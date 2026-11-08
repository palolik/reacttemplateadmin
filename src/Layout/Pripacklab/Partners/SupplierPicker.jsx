/* eslint-disable react/prop-types */

// Supplier dropdown for transferring an order. Suppliers whose categories
// cover the order's categories are listed first.
const SupplierPicker = ({ suppliers, categories = [], value, onChange }) => {
  const wanted = new Set(categories.filter(Boolean));
  const matches = (s) => wanted.size > 0 && (s.categories || []).some((c) => wanted.has(c));
  const matching = suppliers.filter(matches);
  const others = suppliers.filter((s) => !matches(s));
  const label = (s) => `${s.shopName || s.name}${s.district ? ` (${s.district})` : s.location ? ` (${s.location})` : ""}`;

  return (
    <select className="select select-bordered select-sm" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select supplier</option>
      {matching.length > 0 && (
        <optgroup label="Matches this order's categories">
          {matching.map((s) => <option key={s._id} value={s._id}>{label(s)}</option>)}
        </optgroup>
      )}
      {others.length > 0 && (
        <optgroup label={matching.length ? "Other suppliers" : "Suppliers"}>
          {others.map((s) => <option key={s._id} value={s._id}>{label(s)}</option>)}
        </optgroup>
      )}
    </select>
  );
};

export default SupplierPicker;
