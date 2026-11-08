/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import { staffRequest, taka, fetchApprovedSuppliers, SUPPLIER_STATUS_BADGE } from "../Partners/partnerAdminApi";
import SupplierPicker from "../Partners/SupplierPicker";

const STATUSES = ["Pending Verification", "Transferred to Supplier", "Delivered", "Cancelled"];
const STATUS_BADGE = {
  "Pending Verification": "bg-amber-100 text-amber-700",
  "Transferred to Supplier": "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const formatDate = (d) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const OrderDetail = ({ order, suppliers, onClose, onChanged }) => {
  const [supplierId, setSupplierId] = useState(order.supplier?._id || "");
  const [busy, setBusy] = useState(false);

  const act = async (action, extra = {}) => {
    const { value: note, isConfirmed } = await Swal.fire({
      title: { transfer: "Verify & transfer to supplier?", pickedup: "Mark as picked up from supplier?", deliver: "Mark as delivered?", cancel: "Cancel this order?" }[action],
      input: "text",
      inputPlaceholder: "Note for the seller (optional)",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });
    if (!isConfirmed) return;
    setBusy(true);
    try {
      await staffRequest(`/admin/sellerorders/${order._id}`, { method: "PATCH", body: { action, note, ...extra } });
      onChanged();
      onClose();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const canTransfer = ["Pending Verification", "Transferred to Supplier"].includes(order.status)
    && !["Pickup Requested", "Picked Up"].includes(order.supplierStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto dark:text-slate-300" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-slate-400 hover:text-red-500 text-xl">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold dark:text-slate-100">Seller order #{order.referenceCode}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[order.status]}`}>{order.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div className="border rounded-lg p-3 dark:border-slate-700">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Seller</p>
            <p>{order.shopName || order.sellerName}</p>
            <p>{order.sellerName} · {order.sellerPhone}</p>
          </div>
          <div className="border rounded-lg p-3 dark:border-slate-700">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">{order.orderFor === "self" ? "Deliver to seller" : "Customer"}</p>
            <p>{order.customer.name} · {order.customer.phone}</p>
            <p>{order.customer.address}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr><th></th><th>Product</th><th>Qty</th><th>Seller price</th><th>Selling price</th><th>Seller pays</th></tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.image && <img src={`${base_url}${item.image}`} alt="" className="w-10 h-10 object-cover rounded" />}</td>
                  <td>{item.productName}<span className="text-gray-400"> · {item.variantLabel || "Standard"}</span><br /><span className="text-xs text-gray-400">{item.category}</span></td>
                  <td>{item.units}</td>
                  <td>{taka(item.sellerPrice)}</td>
                  <td>{taka(item.sellingPrice)}</td>
                  <td className="font-semibold">{taka(item.costTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-4 text-sm mt-2">
          <span>Seller pays: <b>{taka(order.totals.cost)}</b></span>
          {order.orderFor === "customer" && <span>Customer pays seller: <b>{taka(order.totals.selling)}</b></span>}
          {order.orderFor === "customer" && <span>Seller profit: <b>{taka(order.totals.profit)}</b></span>}
        </div>
        {order.note && <p className="text-sm mt-2"><b>Seller note:</b> {order.note}</p>}
        {order.supplier && (
          <p className="text-sm mt-2">
            <b>Supplier:</b> {order.supplier.name}{order.supplier.phone ? ` · ${order.supplier.phone}` : ""}
            {order.supplierStatus && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${SUPPLIER_STATUS_BADGE[order.supplierStatus] || ""}`}>{order.supplierStatus}</span>
            )}
          </p>
        )}

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">History</p>
          {order.statusHistory.map((h, i) => (
            <p key={i} className="text-xs">{formatDate(h.date)} · {h.status}{h.note ? ` · ${h.note}` : ""}</p>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 mt-6 border-t pt-4 dark:border-slate-700">
          {canTransfer && (
            <>
              <SupplierPicker
                suppliers={suppliers}
                categories={order.items.map((i) => i.category)}
                value={supplierId}
                onChange={setSupplierId}
              />
              <button
                disabled={busy || !supplierId}
                onClick={() => act("transfer", { supplierId })}
                className="btn btn-sm btn-info text-white"
              >
                {order.status === "Transferred to Supplier" ? "Change supplier" : "Verify & transfer"}
              </button>
            </>
          )}
          {order.supplierStatus === "Pickup Requested" && (
            <button disabled={busy} onClick={() => act("pickedup")} className="btn btn-sm btn-info text-white">Mark picked up</button>
          )}
          {order.status === "Transferred to Supplier" && (
            <button disabled={busy} onClick={() => act("deliver")} className="btn btn-sm btn-success">Mark delivered</button>
          )}
          {!["Delivered", "Cancelled"].includes(order.status) && (
            <button disabled={busy} onClick={() => act("cancel")} className="btn btn-sm btn-error">Cancel order</button>
          )}
        </div>
      </div>
    </div>
  );
};

const PSellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [status, setStatus] = useState("Pending Verification");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    staffRequest(`/admin/sellerorders${qs}`)
      .then((data) => setOrders(data.orders || []))
      .catch((err) => Swal.fire("Error", err.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [status]);

  useEffect(() => {
    fetchApprovedSuppliers()
      .then(setSuppliers)
      .catch(() => setSuppliers([]));
  }, []);

  return (
    <div className="w-full">
      <div className="hdr">Seller Orders</div>

      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[...STATUSES, ""].map((s) => (
            <button key={s || "all"} onClick={() => setStatus(s)} className={`btn btn-xs ${status === s ? "btn-info text-white" : "btn-ghost"}`}>
              {s || "All"}
            </button>
          ))}
          <button onClick={fetchOrders} className="btn btn-xs btn-outline ml-auto">Refresh</button>
        </div>

        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Date</th>
                <th>Seller</th>
                <th>For</th>
                <th>Items</th>
                <th>Seller pays</th>
                <th>Supplier</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="text-center border-b">
                  <td className="font-semibold">#{o.referenceCode}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{o.shopName || o.sellerName}<br /><span className="text-xs text-gray-400">{o.sellerPhone}</span></td>
                  <td>{o.orderFor === "self" ? "Seller" : o.customer?.name}</td>
                  <td>{o.items.length}</td>
                  <td>{taka(o.totals.cost)}</td>
                  <td>
                    {o.supplier?.name || "—"}
                    {o.supplierStatus && <><br /><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${SUPPLIER_STATUS_BADGE[o.supplierStatus] || ""}`}>{o.supplierStatus}</span></>}
                  </td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[o.status]}`}>{o.status}</span></td>
                  <td><button onClick={() => setSelected(o)} className="btn btn-xs btn-info text-white">Open</button></td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr><td colSpan="9" className="text-center py-4">No seller orders.</td></tr>
              )}
              {loading && (
                <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <OrderDetail order={selected} suppliers={suppliers} onClose={() => setSelected(null)} onChanged={fetchOrders} />
      )}
    </div>
  );
};

export default PSellerOrders;
