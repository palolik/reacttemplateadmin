import '../../../styles/productview.css';
import '../../../styles/mail.css';
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { base_url } from "../../../config/config";
import { useMailApi } from "../Mail/mailApi";
import { toastError } from "../Mail/mailUtils";
import NotifyModal, { MAX_NOTIFY_RECIPIENTS } from "./NotifyModal";

const PCustomers = () => {
  const loaderCustomers = useLoaderData();
  const [customers, setCustomers] = useState(Array.isArray(loaderCustomers) ? loaderCustomers : []);
  const [selected, setSelected] = useState(() => new Set());
  const [notifying, setNotifying] = useState(null);
  const api = useMailApi();
  const selectAllRef = useRef(null);

  useEffect(() => {
    fetch(`${base_url}/getcustomers`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  // Only customers still in the list count as selected.
  const selectedCustomers = useMemo(() => customers.filter((c) => selected.has(c._id)), [customers, selected]);
  const allSelected = customers.length > 0 && selectedCustomers.length === customers.length;
  const someSelected = selectedCustomers.length > 0 && !allSelected;
  const overLimit = selectedCustomers.length > MAX_NOTIFY_RECIPIENTS;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(customers.map((c) => c._id)));
  };

  const notifySelected = () => {
    if (overLimit) {
      toastError(`At most ${MAX_NOTIFY_RECIPIENTS} customers per notification. ${selectedCustomers.length} are selected.`);
      return;
    }
    setNotifying({ list: selectedCustomers, bulk: true });
  };

  return (
    <div className="w-full">
      <div className="hdr">All Customers</div>

      <div className="w-full px-6 py-4">
        <div className="mb-3 flex justify-between items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {customers.length} customer(s)
            {selectedCustomers.length > 0 && ` · ${selectedCustomers.length} selected`}
            {overLimit && <span className="text-red-600 dark:text-red-400"> (max {MAX_NOTIFY_RECIPIENTS} per notification)</span>}
          </span>
          <div className="flex gap-2">
            {selectedCustomers.length > 0 && (
              <button type="button" className="mbtn mbtn-sm mbtn-simple" onClick={() => setSelected(new Set())}>
                Clear selection
              </button>
            )}
            <button
              type="button"
              className="mbtn mbtn-sm mbtn-gradient"
              disabled={selectedCustomers.length === 0}
              onClick={notifySelected}
            >
              <FiBell className="w-3.5 h-3.5" /> Notify selected
            </button>
          </div>
        </div>

        <div className="ptable-wrap">
          <table className="ptable">
            <thead>
              <tr>
                <th className="w-8">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    aria-label="Select all customers"
                    checked={allSelected}
                    onChange={toggleAll}
                    disabled={customers.length === 0}
                  />
                </th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const checked = selected.has(customer._id);
                return (
                  <tr key={customer._id} className={checked ? "bg-indigo-50/60 dark:bg-indigo-500/10" : undefined}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        aria-label={`Select ${customer.name || customer.email || "customer"}`}
                        checked={checked}
                        onChange={() => toggle(customer._id)}
                      />
                    </td>
                    <td>{customer.name || "—"}</td>
                    <td className="whitespace-nowrap">{customer.phone || "—"}</td>
                    <td className="break-all">{customer.email || "—"}</td>
                    <td>{customer.address || "—"}</td>
                    <td>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300'
                      }`}>
                        {customer.status || "—"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      {customer.dateCreated
                        ? new Date(customer.dateCreated).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="mbtn mbtn-sm mbtn-simple"
                        onClick={() => setNotifying({ list: [customer], bulk: false })}
                      >
                        <FiBell className="w-3.5 h-3.5" /> Notify
                      </button>
                    </td>
                  </tr>
                );
              })}

              {customers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400 dark:text-slate-400">No customers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {notifying && (
        <NotifyModal
          api={api}
          customers={notifying.list}
          onClose={() => setNotifying(null)}
          onSent={() => { if (notifying.bulk) setSelected(new Set()); }}
        />
      )}
    </div>
  );
};

export default PCustomers;
