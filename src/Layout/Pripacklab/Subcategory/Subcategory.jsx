/* eslint-disable no-unused-vars */
import '../../../styles/productview.css';
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { base_url } from '../../../config/config';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>
      {children}
    </div>
  </div>
);

const PSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSubcatData, setEditSubcatData] = useState({ _id: '', catname: '', subcat: '', subcatBn: '' });

  useEffect(() => {
    fetch(`${base_url}/getcatnsub`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        setSubcategories(data.subcategories);
      })
      .catch(error => console.error('Error fetching categories and subcategories:', error));
  }, []);

  const handleAddPost = async (event) => {
    event.preventDefault();
    const form = event.target;
    const subcat = form['subcat']?.value?.trim() || '';
    const subcatBn = form['subcatBn']?.value?.trim() || '';

    if (!selectedCategory) {
      Swal.fire({ title: "Error!", text: "Please select a category.", icon: "error" });
      return;
    }

    const postData = { catname: selectedCategory, subcat, subcatBn };

    try {
      const response = await fetch(`${base_url}/addsub`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (data.insertedId) {
        Swal.fire("Added!", "New subcategory added successfully.", "success");
        form.reset();
        setSelectedCategory('');
        setIsAddModalOpen(false);
        setSubcategories(prev => [...prev, { ...postData, _id: data.insertedId }]);
      } else {
        Swal.fire("Error!", "There was an issue adding the subcategory.", "error");
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!id) return;
    const confirm = await Swal.fire({
      title: "Are you sure?", text: "This subcategory will be deleted permanently.",
      icon: "warning", showCancelButton: true, confirmButtonText: "Yes, Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${base_url}/deletesub/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.deletedCount > 0) {
        Swal.fire("Deleted!", "Subcategory removed.", "success");
        setSubcategories(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete subcategory", "error");
    }
  };

  const handleEditSubcategory = (subcatObj) => {
    setEditSubcatData(subcatObj);
    setIsEditModalOpen(true);
  };

  const handleEditPost = async (event) => {
    event.preventDefault();
    const form = event.target;
    const catname = form['catname'].value;
    const subcat = form['subcat'].value.trim();
    const subcatBn = form['subcatBn'].value.trim();

    try {
      const response = await fetch(`${base_url}/editsub/${editSubcatData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catname, subcat, subcatBn }),
      });
      const data = await response.json();
      if (data.message === 'Subcategory updated successfully') {
        Swal.fire("Updated!", "Subcategory updated successfully.", "success");
        setSubcategories(prev => prev.map(s =>
          s._id === editSubcatData._id ? { ...s, catname, subcat, subcatBn } : s
        ));
        setIsEditModalOpen(false);
      } else {
        Swal.fire("Error!", "There was an issue updating the subcategory.", "error");
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };

  const groupedSubcategories = categories.map(cat => ({
    ...cat,
    subs: subcategories.filter(
      sub => sub.catname.toLowerCase() === cat.catname.toLowerCase()
    )
  }));

  const orphans = subcategories.filter(sub =>
    !categories.some(cat => cat.catname.toLowerCase() === sub.catname.toLowerCase())
  );

  return (
    <div className='w-full flex flex-col'>
      <div className='hdr'>Sub Category</div>

      <div className="w-full p-4">
        {/* Toolbar */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {subcategories.length} subcategories across {categories.length} categories
          </p>
          <button
            className="pributton flex items-center gap-1.5"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus size={16} /> Add Subcategory
          </button>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groupedSubcategories.map((cat) => (
            <div key={cat._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={`${base_url}${cat.iconpic}`}
                    className="w-8 h-8 object-cover rounded-full"
                    alt={cat.catname}
                  />
                  <span className="font-semibold text-gray-800">{cat.catname}</span>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                  {cat.subs.length}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {cat.subs.length === 0 && (
                  <span className="text-gray-400 text-sm italic">No subcategories yet</span>
                )}
                {cat.subs.map((subcatObj) => (
                  <div
                    key={subcatObj._id}
                    className="flex items-center justify-between gap-2 bg-gray-50 rounded-md px-3 py-1.5"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm text-gray-700 truncate">{subcatObj.subcat}</span>
                      {subcatObj.subcatBn && (
                        <span className="text-xs text-gray-400 truncate">{subcatObj.subcatBn}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditSubcategory(subcatObj)}
                        className="text-gray-400 hover:text-blue-600"
                        aria-label="Edit subcategory"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(subcatObj._id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Delete subcategory"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Orphan subcategories */}
          {orphans.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-red-100 pb-2">
                <span className="font-semibold text-red-500">Unmatched</span>
                <span className="text-xs font-medium text-red-500 bg-red-100 rounded-full px-2 py-0.5">
                  {orphans.length}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {orphans.map((subcatObj) => (
                  <div
                    key={subcatObj._id}
                    className="flex items-center justify-between gap-2 bg-white rounded-md px-3 py-1.5"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-red-400">({subcatObj.catname})</span>
                      <span className="text-sm text-gray-700 truncate">{subcatObj.subcat}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditSubcategory(subcatObj)}
                        className="text-gray-400 hover:text-blue-600"
                        aria-label="Edit subcategory"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(subcatObj._id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Delete subcategory"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal title="Add Subcategory" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddPost} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Category Name</span>
              <select
                className="pridrop"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.catname}>{cat.catname}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Subcategory Name</span>
              <input name="subcat" type="text" className="priinput" required />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Subcategory Name (Bangla)</span>
              <input name="subcatBn" type="text" className="priinput" placeholder="বাংলা নাম" />
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">Add Subcategory</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal title="Edit Subcategory" onClose={() => setIsEditModalOpen(false)}>
          <form onSubmit={handleEditPost} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Category Name</span>
              <select name="catname" className="pridrop" defaultValue={editSubcatData.catname} required>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.catname}>{cat.catname}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Subcategory Name</span>
              <input name="subcat" type="text" className="priinput" defaultValue={editSubcatData.subcat} required />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Subcategory Name (Bangla)</span>
              <input name="subcatBn" type="text" className="priinput" defaultValue={editSubcatData.subcatBn} placeholder="বাংলা নাম" />
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">Update Subcategory</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PSubcategory;