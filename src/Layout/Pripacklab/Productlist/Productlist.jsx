import "../../../styles/productview.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import EditProductDrawer from "./Productedit";

const toImageUrl = (path) => {
  if (!path) return null;
  const match = path.replace(/\\/g, "/").match(/(\/uploads\/.+)/);
  return match ? `${base_url}${match[1]}` : `${base_url}/${path}`;
};

// Renders one variant row — combination keys/values are fully dynamic
const VariantRow = ({ v }) => (
  <div className={`flex items-center justify-between gap-2 py-1 border-b border-gray-100 last:border-0 text-xs ${!v.is_active ? "opacity-40" : ""}`}>
    <div className="flex items-center gap-1 flex-wrap">
      {Object.values(v.combination).map((val, i) => (
        <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded font-medium text-gray-700">{val}</span>
      ))}
      {!v.is_active && (
        <span className="text-[9px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded font-semibold">off</span>
      )}
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      {v.price    && <span className="font-bold text-gray-800">৳{v.price}</span>}
      {v.profit   && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-semibold">+{v.profit}</span>}
      {v.discount && <span className="text-[10px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded font-semibold">-{v.discount}%</span>}
    </div>
  </div>
);

const ProductDetailDrawer = ({ p, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images   = p.mainPics || [];
  const variants = p.variants  || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[520px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
  

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

       

    
      

          {/* Criteria */}
          {p.criteria?.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Criteria</p>
              <div className="flex flex-col gap-2">
                {p.criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-gray-600 w-20 shrink-0">{c.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {c.values.map((v, j) => (
                        <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        
       
{/* Description */}
{p.productDescription && (
  <div>
    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Description</p>
    <div
      className="text-gray-700 text-sm leading-relaxed border border-gray-100 rounded-xl p-4 bg-white"
      style={{
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={{
        __html: p.productDescription
          .replace(/(<(p|div|br)\s*\/?>\s*)+$/gi, "")
          .replace(/<img /gi, '<img style="max-width:100%;max-height:400px;object-fit:contain;display:block;margin:8px 0;" ')
          .replace(/<h1/gi, '<h1 style="font-size:1.8em;font-weight:700;margin:8px 0;"')
          .replace(/<h2/gi, '<h2 style="font-size:1.5em;font-weight:700;margin:8px 0;"')
          .replace(/<h3/gi, '<h3 style="font-size:1.25em;font-weight:600;margin:6px 0;"')
          .replace(/<h4/gi, '<h4 style="font-size:1.1em;font-weight:600;margin:6px 0;"')
          .replace(/<p/gi,  '<p style="margin:4px 0;"')
          .replace(/<ul/gi, '<ul style="list-style:disc;padding-left:20px;margin:4px 0;"')
          .replace(/<ol/gi, '<ol style="list-style:decimal;padding-left:20px;margin:4px 0;"')
          .replace(/<blockquote/gi, '<blockquote style="border-left:3px solid #3b82f6;padding-left:12px;color:#6b7280;margin:4px 0;"')
          .replace(/<a /gi, '<a style="color:#3b82f6;text-decoration:underline;" ')
          .trim()
      }}
    />
  </div>
)}
        </div>
      </div>
    </>
  );
};

const ProductRow = ({ p, onDelete, onEdit }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const images   = p.mainPics || [];
  const variants = p.variants  || [];

  return (
    <>
      {showDrawer && <ProductDetailDrawer p={p} onClose={() => setShowDrawer(false)} />}

    <div
      className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setShowDrawer(true)}
    >
      <div className="grid grid-cols-[150px_500px_auto_400px_100px] gap-0 items-stretch">

        {/* ── Image strip ── */}
        <div className="w-24 flex-shrink-0 bg-gray-50 relative">
          {images.length > 0 ? (
            <>
              <img
                src={toImageUrl(images[imgIdx])}
                alt={p.productName}
                className="w-[140px] h-full min-h-[90px] object-cover"
                onError={e => { e.target.src = ""; e.target.className = "hidden"; }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-24 h-full min-h-[90px] flex items-center justify-center text-gray-300 text-[10px]">No image</div>
          )}
        </div>

        {/* ── Main info ── */}
        <div className="px-4 py-3 flex flex-col justify-center gap-1 border-l border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 text-sm">{p.productName}</p>
            {p.subCategory && (
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{p.subCategory}</span>
            )}
            {p.category && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{p.category}</span>
            )}
          </div>

          <p className="font-mono text-[10px] text-gray-400">#{p._id.slice(-8).toUpperCase()}</p>

          <div className="flex gap-3 text-xs text-gray-500">
            {p.productSupplier && <span>Supplier: <b className="text-gray-700">{p.productSupplier}</b></span>}
            {p.deliveryTime    && <span>Delivery: <b className="text-gray-700">{p.deliveryTime}</b></span>}
          </div>

          {/* Criteria chips — dynamic keys */}
          {p.criteria?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {p.criteria.map((c, i) => (
                <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {c.name}: {c.values.join(", ")}
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          {p.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {p.tags.map((tag, i) => (
                <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Image thumbnails ── */}
        <div className="px-3 py-3 flex flex-col justify-center border-l border-gray-100 w-[112px]">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Images ({images.length})</p>
          <div className="flex flex-wrap gap-1">
            {images.slice(0, 4).map((img, i) => (
              <img key={i} src={toImageUrl(img)} alt=""
                onClick={() => setImgIdx(i)}
                className={`w-10 h-10 object-cover rounded border cursor-pointer transition-all ${
                  i === imgIdx ? "border-gray-500 scale-105" : "border-gray-200 hover:border-gray-400"
                }`}
                onError={e => e.target.style.display = "none"} />
            ))}
            {images.length > 4 && (
              <div className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                +{images.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* ── Variants — fully dynamic ── */}
        <div className="px-3 py-3 border-l border-gray-100 ">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
              Variants ({variants.length})
            </p>
            <span className="text-[9px] text-green-500 font-semibold">
              {variants.filter(v => v.is_active).length} active
            </span>
          </div>
          <div className="max-h-[90px] overflow-y-auto pr-1">
            {variants.length === 0
              ? <p className="text-[10px] text-gray-300 italic">No variants</p>
              : variants.map(v => <VariantRow key={v.id} v={v} />)
            }
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="px-3 py-3 flex flex-col justify-center gap-2 border-l border-gray-100 w-24">
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
            className="text-[11px] font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition text-center"
          >
            Edit
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(p._id); }}
            className="text-[11px] font-semibold bg-white border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition text-center"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
    </>
  );
};

const PProductlist = () => {
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const productsPerPage = 7;

  useEffect(() => {
    fetch(`${base_url}/getproducts`)
      .then(res => res.json())
      .then(data => setProductData(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const filtered = productData.filter(p =>
    [p.productName, p.category, p.subCategory, p.productSupplier]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filtered.slice(startIndex, startIndex + productsPerPage);

  useEffect(() => { setCurrentPage(1); }, [search]);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${base_url}/delproduct/${_id}`, { method: "DELETE" })
          .then(res => res.json())
          .then(data => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Product has been removed.", "success");
              setProductData(prev => prev.filter(p => p._id !== _id));
            }
          });
      }
    });
  };

  const handleSaved = () => {
    fetch(`${base_url}/getproducts`)
      .then(res => res.json())
      .then(data => setProductData(data))
      .catch(console.error);
  };

  return (
    <div className="w-full">
      {editProduct && (
        <EditProductDrawer
          p={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={handleSaved}
        />
      )}
      <div className="hdr">Product List</div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-gray-400 font-medium">{filtered.length} products</p>
        <label className="input input-bordered flex input-sm items-center gap-2 w-[280px]">
          <input
            type="text"
            className="grow"
            placeholder="Search by name, category, supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-50">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
          </svg>
        </label>
      </div>

      {/* Column headers */}
      <div className="grid  grid-cols-[150px_500px_auto_400px_100px]  gap-0 px-0 mb-2">
        {["Image", "Product Info", "Gallery", "Variants", "Actions"].map(h => (
          <div key={h} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-4">{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {currentProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-white rounded-xl border border-gray-200">
            No products found.
          </div>
        ) : (
          currentProducts.map(p => <ProductRow key={p._id} p={p} onDelete={handleDelete} onEdit={() => setEditProduct(p)} />)
        )}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default PProductlist;