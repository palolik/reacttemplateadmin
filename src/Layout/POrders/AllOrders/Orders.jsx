import '../../../styles/productview.css'
import { useEffect, useState } from "react";
import { base_url } from '../../../config/config';
import { downloadInvoice } from "./downloadinvoice";

const statusColors = {
  Placed:       { bg: "bg-blue-100",   text: "text-blue-700"   },
  Confirmed:    { bg: "bg-indigo-100", text: "text-indigo-700" },
  "On Making":  { bg: "bg-amber-100",  text: "text-amber-700"  },
  "On Transit": { bg: "bg-orange-100", text: "text-orange-700" },
  Delivered:    { bg: "bg-green-100",  text: "text-green-700"  },
  Cancelled:    { bg: "bg-red-100",    text: "text-red-700"    },
};

const StatusBadge = ({ status }) => {
  const c = statusColors[status] || { bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
};


const TabsView = ({ orders, openStatusModal }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const order = orders[activeIdx];
  if (!order) return <p className="text-sm text-gray-400 p-4">No orders.</p>;

  return (
    <div className="flex h-[780px] rounded-2xl border border-gray-200 overflow-hidden shadow-sm">


      <div className="w-52 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{orders.length} Orders</p>
        </div>
        <div className="overflow-y-auto flex-1">
          {orders.map((o, i) => {
            const c = statusColors[o.currentStatus] || { bg: "bg-gray-100", text: "text-gray-500" };
            return (
              <button
                key={o._id}
                onClick={() => setActiveIdx(i)}
                className={`w-full text-left px-3 py-2.5 border-b border-gray-100 transition-all ${
                  i === activeIdx
                    ? "bg-white border-l-[3px] border-l-gray-900"
                    : "hover:bg-white border-l-[3px] border-l-transparent"
                }`}
              >
                <p className="font-mono text-[11px] font-bold text-gray-700">#{o._id.slice(-7).toUpperCase()}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{o.buyerName}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${c.bg} ${c.text}`}>{o.currentStatus}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(o.orderDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

     
      <div className="flex-1 flex flex-col overflow-hidden bg-white">

      
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-bold">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <StatusBadge status={order.currentStatus} />
            <span className="text-xs text-gray-400">
              {new Date(order.orderDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openStatusModal(order)}
              className="text-xs bg-white border border-gray-300 hover:border-gray-500 text-gray-600 px-3 py-1.5 rounded-lg transition font-medium">
              Update Status
            </button>
            <button onClick={() => downloadInvoice(order)}
              className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition font-medium">
              ↓ Invoice
            </button>
            <button onClick={() => window.open(`/label/${order._id}`, "_blank")}
              className="text-xs bg-white border border-gray-300 hover:border-gray-500 text-gray-600 px-3 py-1.5 rounded-lg transition font-medium">
              🏷️ Print Label
            </button>
          </div>
        </div>

       
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

       
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Customer</p>
              <p className="font-bold text-sm text-gray-800">{order.buyerName}</p>
              <p className="text-xs text-gray-500 mt-1">{order.buyerPhone}</p>
              <p className="text-xs text-gray-500">{order.buyerEmail}</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{order.buyerAddress}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Delivery</p>
              {order.delivery ? (
                <>
                  <p className="font-semibold text-sm text-gray-800">{order.delivery.area}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.delivery.period}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Charge: <b>BDT {order.delivery.charge}</b></p>
                </>
              ) : <p className="text-xs text-gray-400">No delivery info</p>}
            </div>
          </div>

          {/* ── Row 2: Price summary ── */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Summary</p>
            <div className="flex flex-wrap gap-6">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Subtotal</p><p className="font-semibold text-gray-800 text-sm">BDT {order.subtotal}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Delivery</p><p className="font-semibold text-gray-800 text-sm">BDT {order.deliveryCharge}</p></div>
              {order.discount > 0 && <div><p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Discount</p><p className="font-semibold text-teal-600 text-sm">− BDT {order.discount}</p></div>}
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total</p><p className="font-black text-gray-900 text-lg">BDT {order.totalPrice}</p></div>
            </div>
          </div>

          {/* ── Row 3: Payment ── */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div><p className="text-xs text-gray-400 mb-0.5">Method</p><p className="font-semibold text-gray-800">{order.paymentMethod}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Status</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  order.paymentStatus === "Pending Verification" ? "bg-yellow-100 text-yellow-700" :
                  order.paymentStatus === "Verified" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>{order.paymentStatus || "—"}</span>
              </div>
              {order.paymentNumber && <div><p className="text-xs text-gray-400 mb-0.5">Number</p><p className="font-mono text-sm text-gray-800">{order.paymentNumber}</p></div>}
              {order.referenceCode && <div><p className="text-xs text-gray-400 mb-0.5">Reference</p><p className="font-mono text-sm text-gray-800">{order.referenceCode}</p></div>}
              {order.transactionId && <div><p className="text-xs text-gray-400 mb-0.5">Transaction ID</p><p className="font-mono text-sm text-gray-800">{order.transactionId}</p></div>}
              {order.coupon        && <div><p className="text-xs text-gray-400 mb-0.5">Coupon</p><p className="font-semibold text-teal-600">{order.coupon}</p></div>}
            </div>
          </div>

          {/* ── Row 4: Items ── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
              Items ({order.cartItems.length})
            </p>
            <div className="flex flex-col gap-3">
              {order.cartItems.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex gap-3 items-start mb-3">
                    <img src={item.selectedImage || item.mainPics?.[0]} alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-gray-800">{item.productName}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        {item.selectedSize && <span>Size: <b>{item.selectedSize}</b></span>}
                        {item.selectedCut  && <span>Cut: <b>{item.selectedCut}</b></span>}
                        {item.selectedQty  && <span>Qty: <b>{item.selectedQty}</b></span>}
                        {item.units        && <span>Units: <b>{item.units}</b></span>}
                      </div>
                      <p className="text-xs font-bold text-green-600 mt-1">
                        BDT {(parseFloat(item.selectedPrice) * (parseInt(item.units) || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {item.unitDetails?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Unit Details</p>
                      <div className="grid grid-cols-2 gap-2">
                        {item.unitDetails.map((ud, ui) => (
                          <div key={ui} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                            <p className="text-[10px] font-bold text-teal-600 mb-1">Unit {ui + 1}</p>
                            <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: ud.description }} />
                            {ud.filePath && (
                              <a href={`${base_url}${ud.filePath}`} className="text-[10px] text-teal-500 hover:underline mt-1 block"
                                target="_blank" rel="noreferrer">📎 Attachment</a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

         
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Status History</p>
            <div className="flex flex-col gap-2">
              {order.statusHistory?.length > 0 ? order.statusHistory.map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${statusColors[h.status]?.bg || "bg-gray-200"}`} />
                    {i < order.statusHistory.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1 min-h-[20px]" />}
                  </div>
                  <div className="pb-2">
                    <StatusBadge status={h.status} />
                    <p className="text-xs text-gray-600 mt-1">{h.note}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(h.date).toLocaleString()}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-gray-400">No history yet.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const TableView = ({ orders, openStatusModal, updatePaymentStatus }) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[860px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {["Order ID", "Date", "Customer", "Items", "Total", "Payment", "Status", "Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <>
              <tr
                key={order._id}
                onClick={() => setExpandedId(prev => prev === order._id ? null : order._id)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                  expandedId === order._id ? "bg-indigo-50/40" : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/40 hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                    #{order._id.slice(-7).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(order.orderDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-xs text-gray-800">{order.buyerName}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{order.buyerPhone}</p>
                </td>
                <td className="px-4 py-3">
                  {order.cartItems.map((item, idx) => (
                    <p key={idx} className="text-xs text-gray-600 truncate max-w-[130px]">
                      {item.productName}
                      <span className="text-gray-400 ml-1">×{item.units || 1}</span>
                    </p>
                  ))}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-xs font-bold text-gray-800">BDT {order.totalPrice}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{order.paymentMethod}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    order.paymentStatus === "Pending Verification" ? "bg-yellow-100 text-yellow-700" :
                    order.paymentStatus === "Verified" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {order.paymentStatus || order.paymentMethod}
                  </span>
                </td>

<td className="px-4 py-3" onClick={e => e.stopPropagation()}>
  <select
    defaultValue={order.paymentStatus || ""}
    onChange={e => updatePaymentStatus(order._id, e.target.value)}
    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 cursor-pointer outline-none appearance-none ${
      order.paymentStatus === "Pending Verification" ? "bg-yellow-100 text-yellow-700" :
      order.paymentStatus === "Verified"             ? "bg-green-100 text-green-700"  :
                                                       "bg-gray-100 text-gray-500"
    }`}
  >
    <option value="">— Select —</option>
    <option value="Pending Verification">Pending Verification</option>
    <option value="Verified">Verified</option>
        <option value="Failed">Failed</option>


  </select>

                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openStatusModal(order)}
                      className="text-[10px] bg-white border border-gray-300 hover:border-gray-500 text-gray-600 px-2 py-1 rounded-lg transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="text-[10px] bg-gray-900 text-white px-2 py-1 rounded-lg hover:bg-gray-700 transition"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => window.open(`/label/${order._id}`, "_blank")}
                      className="text-[10px] bg-white border border-gray-300 hover:border-gray-500 text-gray-600 px-2 py-1 rounded-lg transition"
                    >
                      Label
                    </button>
                  </div>
                </td>
              </tr>

          
              {expandedId === order._id && (
                <tr key={`${order._id}-exp`} className="border-b border-gray-200 bg-indigo-50/20">
                  <td colSpan={8} className="px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-xs">
                      <div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Address</p>
                        <p className="text-gray-600 leading-relaxed">{order.buyerAddress}</p>
                        <p className="text-gray-500 mt-1">{order.buyerEmail}</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Delivery</p>
                        {order.delivery ? (
                          <>
                            <p className="text-gray-700 font-semibold">{order.delivery.area}</p>
                            <p className="text-gray-500 mt-0.5">{order.delivery.period}</p>
                            <p className="text-gray-500">BDT {order.delivery.charge}</p>
                          </>
                        ) : <p className="text-gray-400">—</p>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Pricing</p>
                        <div className="flex flex-col gap-0.5 text-gray-600">
                          <div className="flex justify-between gap-3"><span>Subtotal</span><span>BDT {order.subtotal}</span></div>
                          <div className="flex justify-between gap-3"><span>Delivery</span><span>BDT {order.deliveryCharge}</span></div>
                          {order.discount > 0 && (
                            <div className="flex justify-between gap-3 text-teal-600"><span>Discount</span><span>−BDT {order.discount}</span></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Payment Detail</p>
                        {order.transactionId ? (
                          <div className="flex flex-col gap-0.5 text-gray-600">
                            <span>Via: <b>{order.paymentMethod}</b></span>
                            {order.referenceCode && <span>Ref: <b className="font-mono">{order.referenceCode}</b></span>}
                            <span>TrxID: <b className="font-mono">{order.transactionId}</b></span>
                          </div>
                        ) : <p className="text-gray-400">Pay on delivery</p>}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const PAllOrders = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder]     = useState(null);
  const [newStatus, setNewStatus]             = useState("");
  const [note, setNote]                       = useState("");
  const [orderData, setOrderData]             = useState([]);
  const [viewMode, setViewMode]               = useState("table");
  const ordersPerPage = 10;
  const [currentPage, setCurrentPage]         = useState(1);

  useEffect(() => {
    fetch(`${base_url}/getallorders`)
      .then(res => res.json())
      .then(data => setOrderData(data.orders || []))
      .catch(err => console.error(err));
  }, []);

  const startIndex    = (currentPage - 1) * ordersPerPage;
  const currentOrders = orderData.slice(startIndex, startIndex + ordersPerPage);
  const totalPages    = Math.ceil(orderData.length / ordersPerPage);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus("");
    setNote("");
    setShowStatusModal(true);
  };

  const updateOrderStatus = async () => {
    if (!newStatus || !note) { alert("Status and note are required"); return; }
    try {
      const res = await fetch(`${base_url}/order/status/${selectedOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderData(prev => prev.map(o =>
          o._id === selectedOrder._id ? { ...o, currentStatus: newStatus } : o
        ));
        setShowStatusModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };
const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const res = await fetch(`${base_url}/order/paymentstatus/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus, payment: paymentStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setOrderData(prev => prev.map(o =>
        o._id === orderId ? { ...o, paymentStatus } : o
      ));
    }
  } catch (err) {
    console.error(err);
    alert("Failed to update payment status");
  }
};


  return (
    <div className="w-full ">
 <div className="hdr">All Orders</div>
      <div className="flex items-center justify-between mb-5">
      

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" />
            </svg>
            Table
          </button>
          <button
            onClick={() => setViewMode("tabs")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "tabs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
            Detail
          </button>
        </div>
      </div>

      {viewMode === "table"
        ? <TableView orders={currentOrders} openStatusModal={openStatusModal} updatePaymentStatus={updatePaymentStatus} />
        : <TabsView  orders={currentOrders} openStatusModal={openStatusModal} />
      }

      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition"
        >← Prev</button>
        <span className="text-sm text-gray-500 font-medium">{currentPage} / {totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition"
        >Next →</button>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4">Update Order Status</h3>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="w-full mb-3 p-2.5 border border-gray-200 rounded-xl bg-white text-sm"
            >
              <option value="">Select Status</option>
              <option value="Placed">Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="On Making">On Making</option>
              <option value="On Transit">On Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <textarea
              placeholder="Enter note"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full mb-4 p-2.5 border border-gray-200 rounded-xl bg-white text-sm resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowStatusModal(false)} className="smbut">Cancel</button>
              <button onClick={updateOrderStatus} className="smbut">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PAllOrders;