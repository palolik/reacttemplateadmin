/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { staffRequest, taka } from "../Partners/partnerAdminApi";

const STATUSES = ["Pending Verification", "Verified", "Rejected"];
const STATUS_BADGE = {
  "Pending Verification": "bg-amber-100 text-amber-700",
  Verified: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const formatDate = (d) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const PSellerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("Pending Verification");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchPayments = () => {
    setLoading(true);
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    staffRequest(`/admin/sellerpayments${qs}`)
      .then((data) => setPayments(data.payments || []))
      .catch((err) => Swal.fire("Error", err.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPayments, [status]);

  const act = async (payment, action) => {
    let note = "";
    if (action === "reject") {
      const { value, isConfirmed } = await Swal.fire({
        title: "Reject this payment?",
        input: "text",
        inputPlaceholder: "Reason for the seller (optional)",
        showCancelButton: true,
        confirmButtonText: "Reject",
      });
      if (!isConfirmed) return;
      note = value;
    } else {
      const { isConfirmed } = await Swal.fire({
        title: "Verify this payment?",
        text: "This will mark the covered orders as paid.",
        showCancelButton: true,
        confirmButtonText: "Verify",
      });
      if (!isConfirmed) return;
    }

    setBusyId(payment._id);
    try {
      await staffRequest(`/admin/sellerpayments/${payment._id}`, { method: "PATCH", body: { action, note } });
      await Swal.fire("Done", `Payment ${action === "verify" ? "verified" : "rejected"}.`, "success");
      fetchPayments();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="hdr">Seller Payments</div>

      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[...STATUSES, ""].map((s) => (
            <button key={s || "all"} onClick={() => setStatus(s)} className={`btn btn-xs ${status === s ? "btn-info text-white" : "btn-ghost"}`}>
              {s || "All"}
            </button>
          ))}
          <button onClick={fetchPayments} className="btn btn-xs btn-outline ml-auto">Refresh</button>
        </div>

        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="text-center border-b">
                  <td>{p.shopName || p.sellerName}<br /><span className="text-xs text-gray-400">{p.sellerPhone}</span></td>
                  <td className="font-semibold">{taka(p.amount)}</td>
                  <td>{p.method}<br /><span className="text-xs text-gray-400">{p.paymentNumber}</span></td>
                  <td>{p.transactionId}</td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                  <td>
                    {p.status === "Pending Verification" && (
                      <div className="flex gap-1 justify-center">
                        <button disabled={busyId === p._id} onClick={() => act(p, "verify")} className="btn btn-xs btn-success">Verify</button>
                        <button disabled={busyId === p._id} onClick={() => act(p, "reject")} className="btn btn-xs btn-error">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && payments.length === 0 && (
                <tr><td colSpan="7" className="text-center py-4">No seller payments.</td></tr>
              )}
              {loading && (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PSellerPayments;
