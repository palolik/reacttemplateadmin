import '../../../styles/productview.css';
import { useEffect, useState } from "react";
import { base_url } from '../../../config/config';

// Must match ADMIN_REPLY_NAME on the backend, which counts unanswered comments by it.
const ADMIN_NAME = "Pripack";
const PER_PAGE = 7;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unanswered", label: "Unanswered" },
  { id: "hidden", label: "Hidden" },
];

const toImageUrl = (path) => {
  if (!path) return null;
  const match = path.replace(/\\/g, "/").match(/(\/uploads\/.+)/);
  return match ? `${base_url}${match[1]}` : `${base_url}/${path}`;
};

const formatDate = (d) => (d
  ? new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  : "");

const isAnswered = (c) => c.replies?.some((r) => r.userName === ADMIN_NAME);
// Comments saved before the status field existed are shown on the site.
const isHidden = (c) => c.status === "hide";

const PComments = () => {
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchComments = async () => {
    const res = await fetch(`${base_url}/allcomments`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => { setCurrentPage(1); }, [filter, search]);

  const term = search.trim().toLowerCase();
  const filtered = comments.filter((c) => {
    if (filter === "unanswered" && isAnswered(c)) return false;
    if (filter === "hidden" && !isHidden(c)) return false;
    if (!term) return true;
    return [c.product?.name, c.userName, c.message]
      .some((v) => v?.toLowerCase().includes(term));
  });

  const counts = {
    all: comments.length,
    unanswered: comments.filter((c) => !isAnswered(c)).length,
    hidden: comments.filter(isHidden).length,
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const currentComments = filtered.slice(startIndex, startIndex + PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Hide / Show
  const toggleStatus = async (id, hidden) => {
    await fetch(`${base_url}/commentstatus/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: hidden ? "show" : "hide" }),
    });
    fetchComments();
  };

  // Admin Reply
  const submitReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;

    await fetch(`${base_url}/replycomment/${commentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: ADMIN_NAME,
        message: replyText[commentId].trim(),
      }),
    });

    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    fetchComments();
  };

  return (
    <div className="w-full">
      <div className="hdr">All Comments</div>
      <div className="px-6 py-4">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                filter === f.id
                  ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
              }`}
            >
              {f.label} <span className="opacity-60">({counts[f.id]})</span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search product, user or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[280px] border rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      {currentComments.length === 0 && (
        <div className="text-center text-gray-400 dark:text-slate-400 py-16 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700">
          No comments found.
        </div>
      )}

      {currentComments.map((comment) => {
        const hidden = isHidden(comment);
        const answered = isAnswered(comment);
        const image = toImageUrl(comment.product?.image);

        return (
          <div
            key={comment._id}
            className={`bg-white dark:bg-slate-900 mb-4 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden ${hidden ? "opacity-70" : ""}`}
          >
            {/* Product */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700">
              <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt={comment.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-[9px] text-gray-400 dark:text-slate-400">No image</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                  {comment.product?.name || "Deleted product"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {comment.product?.category && (
                    <span className="text-[10px] bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                      {comment.product.category}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-gray-400 dark:text-slate-400">
                    #{String(comment.productId).slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  answered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {answered ? "Answered" : "Needs reply"}
                </span>
                <button
                  onClick={() => toggleStatus(comment._id, hidden)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${
                    hidden ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {hidden ? "Show" : "Hide"}
                </button>
              </div>
            </div>

            <div className="px-4 py-3">
              {/* Comment */}
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                  {comment.userName}
                  {hidden && <span className="ml-2 text-[10px] font-semibold text-red-500">Hidden on site</span>}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-slate-400 shrink-0">
                  {formatDate(comment.createdAt)} · {comment.likes || 0} likes
                </p>
              </div>
              <p className="text-gray-700 dark:text-slate-300 text-sm mb-3 whitespace-pre-line">
                {comment.message}
              </p>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="border-l-2 border-gray-200 dark:border-slate-700 pl-4 space-y-2 mb-3">
                  {comment.replies.map((r) => {
                    const isAdmin = r.userName === ADMIN_NAME;
                    return (
                      <div
                        key={r._id}
                        className={`p-2 rounded-lg ${isAdmin ? "bg-blue-50 dark:bg-blue-950/40" : "bg-gray-50 dark:bg-slate-800/60"}`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <p className={`text-xs font-semibold ${isAdmin ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-slate-300"}`}>
                            {r.userName}{isAdmin && " (Admin)"}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-400">{formatDate(r.createdAt)}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300">{r.message}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reply Box */}
              <form
                className="flex gap-2"
                onSubmit={(e) => { e.preventDefault(); submitReply(comment._id); }}
              >
                <input
                  type="text"
                  placeholder="Reply as admin..."
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [comment._id]: e.target.value,
                    })
                  }
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                >
                  Reply
                </button>
              </form>
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40"
          >
            ← Prev
          </button>

          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{currentPage} / {totalPages}</span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PComments;
