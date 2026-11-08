/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import { staffRequest, fetchApprovedSuppliers, SUPPLIER_STATUS_BADGE } from "./partnerAdminApi";
import SupplierPicker from "./SupplierPicker";

// Check a customer order's details and attachments, then transfer it to a
// supplier. A 'Placed' order becomes 'Confirmed' for the customer.
const OrderSupplierTransfer = ({ order, onClose, onTransferred }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(order.supplier?._id || "");
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchApprovedSuppliers().then(setSuppliers).catch((err) => Swal.fire("Error", err.message, "error"));
  }, []);

  const locked = ["Pickup Requested", "Picked Up"].includes(order.supplierStatus)
    || ["Delivered", "Cancelled", "On Transit"].includes(order.currentStatus);
  const attachments = (order.cartItems || []).flatMap((item) => (item.unitDetails || []).filter((u) => u.filePath));

  const transfer = async () => {
    setBusy(true);
    try {
      const data = await staffRequest(`/admin/orders/${order._id}/supplier`, { method: "PATCH", body: { supplierId, note } });
      Swal.fire("Transferred", `Order sent to ${data.supplier.name}.`, "success");
      onTransferred({
        supplier: data.supplier,
        supplierStatus: data.supplierStatus,
        currentStatus: order.currentStatus === "Placed" ? "Confirmed" : order.currentStatus,
      });
      onClose();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto dark:text-slate-300" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-slate-400 hover:text-red-500 text-xl">✕</button>
        <h3 className="text-lg font-semibold dark:text-slate-100 mb-1">Transfer order #{order.referenceCode || String(order._id).slice(-7).toUpperCase()} to supplier</h3>
        <p className="text-xs text-gray-400 mb-4">The supplier sees products, options, notes and attachments. Buyer contact details and prices stay hidden.</p>

        {order.supplier && (
          <p className="text-sm mb-3">
            Current supplier: <b>{order.supplier.name}</b>
            {order.supplierStatus && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${SUPPLIER_STATUS_BADGE[order.supplierStatus] || ""}`}>{order.supplierStatus}</span>}
          </p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {(order.cartItems || []).map((item, i) => (
            <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-lg p-2 text-sm">
              <p className="font-medium dark:text-slate-100">{item.productName} × {item.units || 1}</p>
              {[item.selectedSize, item.selectedCut, item.selectedQty].some(Boolean) && (
                <p className="text-xs text-gray-500">{[item.selectedSize, item.selectedCut, item.selectedQty].filter(Boolean).join(" · ")}</p>
              )}
              {(item.unitDetails || []).map((u, ui) => (
                <div key={ui} className="text-xs mt-1 flex gap-2 items-start">
                  <span className="font-semibold text-teal-600">Unit {ui + 1}</span>
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: u.description || "" }} />
                  {u.filePath
                    ? <a href={`${base_url}${u.filePath}`} target="_blank" rel="noreferrer" className="text-teal-600 underline shrink-0">📎 Open file</a>
                    : <span className="text-amber-600 shrink-0">No file</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-3">{attachments.length} attachment(s) on this order.</p>

        {locked ? (
          <p className="text-sm text-amber-600">This order can no longer be transferred ({order.supplierStatus || order.currentStatus}).</p>
        ) : (
          <>
            <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              I checked the attachments and order details
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <SupplierPicker
                suppliers={suppliers}
                categories={(order.cartItems || []).map((i) => i.category)}
                value={supplierId}
                onChange={setSupplierId}
              />
              <input className="input input-bordered input-sm flex-1 min-w-[180px]" placeholder="Note for the supplier (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              <button onClick={transfer} disabled={busy || !supplierId || !checked} className="btn btn-sm btn-info text-white">
                {order.supplier ? "Change supplier" : "Transfer"}
              </button>
            </div>
            {suppliers.length === 0 && <p className="text-xs text-amber-600 mt-2">No approved suppliers yet. Approve one under Suppliers.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSupplierTransfer;
