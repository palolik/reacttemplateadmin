import '../../../styles/productview.css';
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { base_url } from '../../../config/config';
const REVIEWS_PER_PAGE = 10;

const StarRating = ({ rating }) => {
  const num = Number(rating) || 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= num ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );
};

// Lightbox modal for viewing media fullscreen
const MediaLightbox = ({ files, onClose }) => {
  const [idx, setIdx] = useState(0);
  if (!files || files.length === 0) return null;
  const current = files[idx];

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 truncate">{current.originalName}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
        </div>
        <div className="flex items-center justify-center bg-gray-50 min-h-[300px] max-h-[500px]">
          <img
            src={`${base_url}${current.url}`}
            alt={current.originalName}
            className="max-h-[500px] max-w-full object-contain"
          />
        </div>
        {files.length > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
            >← Prev</button>
            <span className="text-xs text-gray-400">{idx + 1} / {files.length}</span>
            <button
              onClick={() => setIdx(i => Math.min(files.length - 1, i + 1))}
              disabled={idx === files.length - 1}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const PReviews = () => {
  const [reviews, setReviews]           = useState([]);
  const [search, setSearch]             = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [lightboxFiles, setLightboxFiles] = useState(null);

  const fetchReviews = () => {
    fetch(`${base_url}/getreviews`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${base_url}/togglereview/${id}`, { method: 'PUT' });
      const data = await res.json();
      if (data.modifiedCount > 0) fetchReviews();
    } catch {
      Swal.fire('Error', 'Could not toggle visibility.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete review?', text: "This can't be undone.",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res  = await fetch(`${base_url}/deletereview/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.deletedCount > 0) {
        Swal.fire('Deleted!', 'Review deleted.', 'success');
        fetchReviews();
      }
    } catch {
      Swal.fire('Error', 'Could not delete review.', 'error');
    }
  };

  const exportData = () => {
    const rows = reviews.map(r => ({
      ProductId:    r.productId,
      CustomerName: r.customerName,
      Email:        r.customerEmail,
      Rating:       r.rating,
      Review:       r.message,
      Visible:      r.visible ? 'Shown' : 'Hidden',
      Date:         r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    }));
    const csv = [
      Object.keys(rows[0] || {}).join(','),
      ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'reviews.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = reviews.filter(r =>
    [r.customerName, r.customerEmail, r.productId, r.message]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages   = Math.ceil(filtered.length / REVIEWS_PER_PAGE);
  const startIndex   = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [search]);

  return (
    <div className="w-full">
      <div className="hdr">All Reviews</div>

      <div className="bg-white pl-4 m-2 flex flex-row justify-between items-center">
        <div>
          <button className="smbut mr-2">Import</button>
          <button className="smbut" onClick={exportData}>Export</button>
        </div>
        <div className="w-[300px]">
          <label className="input input-bordered flex input-sm items-center gap-2">
            <input type="text" className="grow" placeholder="Search by name, email, product..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
              fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
          </label>
        </div>
      </div>

      <div className="tabst">
        <div>Product</div>
        <div>Customer Info</div>
        <div>Rating</div>
        <div>Review</div>
        <div>Media</div>
        <div>Date</div>
        <div>Visibility</div>
        <div>Actions</div>
      </div>

      <div className="flex flex-col m-2">
        {currentItems.length === 0 && (
          <div className="text-center text-gray-400 py-8">No reviews found.</div>
        )}
        {currentItems.map((review) => (
          <div key={review._id} className={`tabc ${!review.visible ? 'opacity-50' : ''}`}>

            {/* Product */}
            <div className="flex flex-row gap-1 items-center">
              {review.productInfo?.mainImage ? (
                <img
                  src={`${base_url}${review.productInfo.mainImage}`}
                  alt={review.productInfo.productName}
                  className="w-16 h-16 object-cover rounded border"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-gray-300 text-xs">
                  No img
                </div>
              )}
              <p className="text-xs font-semibold">{review.productInfo?.productName}</p>
            </div>

            {/* Customer */}
            <div>
              <p><strong>{review.customerName || '—'}</strong></p>
              <p className="text-sm text-gray-500">{review.customerEmail || ''}</p>
              <p className="text-sm text-gray-500">{review.customerPhone || ''}</p>
            </div>

            {/* Rating */}
            <div>
              <StarRating rating={review.rating} />
              <p className="text-xs text-gray-400">{review.rating}/5</p>
            </div>

            {/* Review message */}
            <div>
              <p className="text-sm">{review.message || '—'}</p>
            </div>

            {/* Media — thumbnails with lightbox */}
            <div>
              {review.media && review.media.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {review.media.map((file, i) => (
                    <button
                      key={i}
                      title={file.originalName}
                      onClick={() => setLightboxFiles({ files: review.media, startIdx: i })}
                      className="focus:outline-none"
                    >
                      <img
                        src={`${base_url}${file.url}`}
                        alt={file.originalName}
                        className="w-12 h-12 object-cover rounded border border-gray-200 hover:opacity-75 hover:border-gray-400 transition"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </div>

            {/* Date */}
            <div>
              <p className="text-sm">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '—'}
              </p>
            </div>

            {/* Visibility */}
            <div>
              <button
                className={`smbut ${review.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => handleToggle(review._id)}
              >
                {review.visible ? '👁 Shown' : '🚫 Hidden'}
              </button>
            </div>

            {/* Actions */}
            <div>
              <button className="smbut" onClick={() => handleDelete(review._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-5 mb-3">
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

      {/* Lightbox */}
      {lightboxFiles && (
        <MediaLightbox
          files={lightboxFiles.files}
          onClose={() => setLightboxFiles(null)}
        />
      )}
    </div>
  );
};

export default PReviews;