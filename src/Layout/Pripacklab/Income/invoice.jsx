import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { base_url } from "../../../config/config";

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${base_url}/getorder/${orderId}`)
      .then(r => r.json())
      .then(data => { setOrder(data.order || data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [orderId]);

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
      Loading invoice...
    </div>
  );

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen text-red-400 text-sm">
      Order not found.
    </div>
  );

  const invoiceNumber = `INV-${order._id.slice(-8).toUpperCase()}`;
  const orderDate     = new Date(order.orderDate).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <>
      {/* ── Print styles injected via style tag ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-root, #invoice-root * { visibility: visible; }
          #invoice-root { position: fixed; inset: 0; }
          #print-btn { display: none !important; }
          @page { margin: 16mm; size: A4; }
        }
      `}</style>

      {/* ── Screen: action bar ── */}
      <div id="print-btn" className="w-full bg-gray-100 border-b border-gray-200 px-6 py-3 flex items-center justify-between print:hidden">
        <p className="text-sm text-gray-500 font-medium">Invoice Preview — {invoiceNumber}</p>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-10 0v4h8v-4H6z" />
          </svg>
          Print / Download PDF
        </button>
      </div>

      {/* ── Invoice ── */}
      <div className="bg-gray-100 min-h-screen py-8 px-4 print:bg-white print:p-0">
        <div
          id="invoice-root"
          className="bg-white max-w-3xl mx-auto shadow-lg rounded-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-full"
        >

          {/* Header band */}
          <div className="bg-gray-900 text-white px-8 py-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">INVOICE</h1>
              <p className="text-gray-400 text-sm mt-0.5">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              {/* Replace with your company name/logo */}
              <p className="text-lg font-bold">Your Company</p>
              <p className="text-gray-400 text-xs mt-0.5">yourcompany.com</p>
              <p className="text-gray-400 text-xs">support@yourcompany.com</p>
            </div>
          </div>

          <div className="px-8 py-6">

            {/* Meta row */}
            <div className="flex flex-wrap justify-between gap-4 mb-7 pb-6 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bill To</p>
                <p className="font-bold text-gray-800 text-sm">{order.buyerName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.buyerPhone}</p>
                {order.buyerEmail && <p className="text-xs text-gray-500">{order.buyerEmail}</p>}
                <p className="text-xs text-gray-500 max-w-[200px] leading-snug mt-0.5">{order.buyerAddress}</p>
              </div>
              <div className="text-right">
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Invoice Date</p>
                  <p className="text-sm text-gray-700 font-medium">{orderDate}</p>
                </div>
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Order Status</p>
                  <p className="text-sm text-gray-700 font-semibold">{order.currentStatus}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Payment</p>
                  <p className="text-sm text-gray-700 font-medium">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            {order.delivery && (
              <div className="mb-6 bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-6 text-xs text-gray-600">
                <div><span className="font-bold text-gray-400 uppercase tracking-widest mr-1">Area:</span>{order.delivery.area}</div>
                <div><span className="font-bold text-gray-400 uppercase tracking-widest mr-1">Period:</span>{order.delivery.period}</div>
                <div><span className="font-bold text-gray-400 uppercase tracking-widest mr-1">Delivery Charge:</span>৳{order.delivery.charge}</div>
              </div>
            )}

            {/* Items table */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3">Product</th>
                  <th className="text-center py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3">Size / Cut</th>
                  <th className="text-center py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3">Qty</th>
                  <th className="text-center py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3">Units</th>
                  <th className="text-right py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3">Price</th>
                  <th className="text-right py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((item, idx) => {
                  const units    = parseInt(item.units) || 1;
                  const price    = parseFloat(item.selectedPrice) || 0;
                  const rowTotal = price * units;
                  return (
                    <tr key={idx} className="border-b border-gray-100 align-top">
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-gray-800">{item.productName}</p>
                        {/* Unit descriptions */}
                        {item.unitDetails?.length > 0 && (
                          <div className="mt-1.5 flex flex-col gap-1">
                            {item.unitDetails.map((ud, ui) => (
                              <div key={ui} className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-600">Unit {ui + 1}:</span>{" "}
                                <span dangerouslySetInnerHTML={{
                                  __html: ud.description.replace(/<[^>]*>/g, " ").trim()
                                }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-center text-gray-500 text-xs">
                        {item.selectedSize && <div>{item.selectedSize}</div>}
                        {item.selectedCut  && <div>{item.selectedCut}</div>}
                      </td>
                      <td className="py-3 text-center text-gray-600">{item.selectedQty || "—"}</td>
                      <td className="py-3 text-center text-gray-600">{units}</td>
                      <td className="py-3 text-right text-gray-600">৳{price.toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-gray-800">৳{rowTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-64 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Charge</span>
                  <span>৳{(order.deliveryCharge || 0).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-teal-600">
                    <span>Discount {order.coupon ? `(${order.coupon})` : ""}</span>
                    <span>− ৳{parseFloat(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-200 pt-2 mt-1">
                  <span>Total</span>
                  <span>৳{parseFloat(order.totalPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment details (online) */}
            {order.transactionId && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-xs text-gray-600 flex flex-wrap gap-4">
                <div><span className="font-bold text-gray-500 uppercase tracking-widest mr-1">Payment Via:</span>{order.paymentMethod}</div>
                {order.referenceCode  && <div><span className="font-bold text-gray-500 uppercase tracking-widest mr-1">Ref:</span>{order.referenceCode}</div>}
                {order.transactionId  && <div><span className="font-bold text-gray-500 uppercase tracking-widest mr-1">TrxID:</span>{order.transactionId}</div>}
                {order.paymentStatus  && <div><span className="font-bold text-gray-500 uppercase tracking-widest mr-1">Status:</span>{order.paymentStatus}</div>}
              </div>
            )}

            {/* Footer note */}
            <div className="border-t border-gray-100 pt-5 text-center text-xs text-gray-400">
              <p>Thank you for your order! For queries contact us at <span className="text-gray-600">support@yourcompany.com</span></p>
              <p className="mt-1">This is a computer-generated invoice and does not require a physical signature.</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;