import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { FiBell } from "react-icons/fi";
import MailModal from "../Mail/MailModal";
import { errorMessage, useSubmitGuard } from "../Mail/mailApi";
import { toastError, toastSuccess } from "../Mail/mailUtils";

export const MAX_NOTIFY_RECIPIENTS = 500;
const MAX_TITLE = 200;
const MAX_MESSAGE = 2000;
const MAX_URL = 500;

const empty = { title: "", message: "", url: "" };
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Sends an in-app notification (plus a browser push where the customer enabled it) to one or
// more customers via POST /notifications. `onSent` runs after a successful send.
export default function NotifyModal({ api, customers, onClose, onSent }) {
  const [form, setForm] = useState(empty);
  const [submitting, guard] = useSubmitGuard();

  const dirty = Object.keys(empty).some((key) => form[key] !== empty[key]);
  const field = (key) => ({ value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });

  const single = customers.length === 1 ? customers[0] : null;
  const heading = single
    ? `Notify ${single.name || single.email || single.phone || "customer"}`
    : `Notify ${plural(customers.length, "customer")}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    guard(async () => {
      const title = form.title.trim();
      const message = form.message.trim();
      const url = form.url.trim();
      if (!customers.length) return toastError("Select at least one customer.");
      if (customers.length > MAX_NOTIFY_RECIPIENTS) return toastError(`At most ${MAX_NOTIFY_RECIPIENTS} customers per notification.`);
      if (!title) return toastError("Add a title.");
      if (!message) return toastError("Write a message.");
      if (url && (!url.startsWith("/") || url.startsWith("//"))) {
        return toastError("The link must be a site path starting with '/', e.g. /profile.");
      }

      const payload = { userIds: customers.map((c) => c._id), title, message };
      if (url) payload.url = url;

      const data = await api("/notifications", "POST", payload);
      if (!data.success) {
        if (data.status !== 401) toastError(errorMessage(data, "Could not send the notification."));
        return;
      }

      const sent = Number(data.sent) || 0;
      const notFound = Number(data.notFound) || 0;
      const summary = `Sent to ${plural(sent, "customer")}`;
      if (notFound > 0) {
        Swal.fire({
          icon: sent > 0 ? "success" : "warning",
          title: summary,
          text: `${notFound} not found.`,
          confirmButtonColor: "#ef4444",
        });
      } else {
        toastSuccess(summary);
      }
      onSent?.();
      onClose();
    });
  };

  return (
    <MailModal title={heading} onClose={onClose} dirty={dirty} busy={submitting}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!single && (
          <p className="text-sm text-gray-600 dark:text-slate-300 break-words">
            {customers.slice(0, 5).map((c) => c.name || c.email || c.phone || c._id).join(", ")}
            {customers.length > 5 && ` and ${customers.length - 5} more`}
          </p>
        )}
        <div>
          <label className="mlabel" htmlFor="notify-title">Title</label>
          <input id="notify-title" className="minput" required maxLength={MAX_TITLE} {...field("title")} />
        </div>
        <div>
          <label className="mlabel" htmlFor="notify-message">Message</label>
          <textarea
            id="notify-message"
            className="textarea textarea-bordered w-full bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 border-gray-300 dark:border-slate-700"
            rows={5}
            required
            maxLength={MAX_MESSAGE}
            {...field("message")}
          />
          <p className="text-xs text-gray-400 dark:text-slate-500 text-right mt-1">{form.message.length}/{MAX_MESSAGE}</p>
        </div>
        <div>
          <label className="mlabel" htmlFor="notify-url">Link (optional site path)</label>
          <input
            id="notify-url"
            className="minput font-mono"
            maxLength={MAX_URL}
            placeholder="/profile"
            {...field("url")}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Saved as an in-app notification and pushed to the customer&apos;s browsers where they enabled notifications.
        </p>
        <div className="flex justify-end">
          <button type="submit" className="mbtn mbtn-gradient" disabled={submitting} aria-busy={submitting}>
            {submitting ? <span className="loading loading-spinner loading-xs" /> : <FiBell className="w-4 h-4" />}
            {submitting ? "Sending…" : "Send notification"}
          </button>
        </div>
      </form>
    </MailModal>
  );
}

NotifyModal.propTypes = {
  api: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  onSent: PropTypes.func,
};
