import "../../../styles/productview.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import ComboForm, { toImageUrl } from "./ComboForm";

// Same calendar the backend uses for combo date windows.
const todayStr = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());

const comboStatus = (combo) => {
  const today = todayStr();
  if (combo.remaining <= 0) return { label: "Sold out", cls: "bg-red-100 text-red-600" };
  if (today < combo.startDate) return { label: "Upcoming", cls: "bg-blue-100 text-blue-700" };
  if (today > combo.endDate) return { label: "Ended", cls: "bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300" };
  return { label: "Live", cls: "bg-green-100 text-green-700" };
};

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit

  const fetchCombos = () =>
    fetch(`${base_url}/combos`)
      .then((res) => res.json())
      .then((data) => setCombos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching combos:", err))
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchCombos();
    fetch(`${base_url}/getproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleDelete = (combo) => {
    Swal.fire({
      title: "Delete this combo?",
      text: `"${combo.title}" will be removed from the store. This can't be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (!result.isConfirmed) return;
      fetch(`${base_url}/delcombo/${combo._id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            setCombos((prev) => prev.filter((c) => c._id !== combo._id));
            Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
          } else {
            Swal.fire({ icon: "error", title: "Delete failed", text: data.message || "Combo not found" });
          }
        });
    });
  };

  return (
    <div className="w-full">
      <div className="hdr">Combo Packages</div>

      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-full">
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Bundles of existing products shown on the home page while they are live.
          </p>
          <button className="smbut" onClick={() => setEditing(null)}>+ New Combo</button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-gray-400 py-10">Loading combos...</p>
        ) : combos.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
            <p className="text-gray-500 dark:text-slate-400 mb-3">No combo packages yet.</p>
            <button className="smbut" onClick={() => setEditing(null)}>Create your first combo</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {combos.map((combo) => {
              const status = comboStatus(combo);
              const savings = (combo.individualTotal || 0) - (combo.comboPrice || 0);
              return (
                <div key={combo._id}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex flex-wrap items-center gap-4 hover:shadow-md transition">
                  <img src={toImageUrl(combo.image)} alt={combo.title}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-100 dark:bg-slate-800" />

                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 dark:text-slate-100">{combo.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.cls}`}>{status.label}</span>
                    </div>
                    {combo.titleBn && <p className="text-sm text-gray-500 dark:text-slate-400">{combo.titleBn}</p>}
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-[420px]">
                      {(combo.items || []).map((i) => `${i.quantity > 1 ? `${i.quantity}× ` : ""}${i.productName} (${i.variantLabel})`).join(" · ")}
                    </p>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-xs text-gray-400 line-through">৳{combo.individualTotal}</p>
                    <p className="font-bold text-gray-900 dark:text-slate-100">৳{combo.comboPrice}</p>
                    {savings > 0 && <p className="text-[11px] text-green-600">Save ৳{Math.round(savings * 100) / 100}</p>}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-slate-400 min-w-[150px]">
                    <p>{combo.startDate} → {combo.endDate}</p>
                    <p className="mt-1">
                      <span className="font-semibold text-gray-700 dark:text-slate-200">{combo.remaining}</span> of {combo.totalCount} left
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setEditing(combo)}
                      className="text-[11px] font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(combo)}
                      className="text-[11px] font-semibold bg-white dark:bg-slate-900 border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editing !== undefined && (
        <ComboForm
          key={editing?._id || "new"}
          combo={editing}
          products={products}
          onClose={() => setEditing(undefined)}
          onSaved={fetchCombos}
        />
      )}
    </div>
  );
};

export default Combos;
