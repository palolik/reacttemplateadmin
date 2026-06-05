/* eslint-disable no-unused-vars */
import '../../../styles/productview.css';
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
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

    if (!selectedCategory) {
      Swal.fire({ title: "Error!", text: "Please select a category.", icon: "error" });
      return;
    }

    const postData = { catname: selectedCategory, subcat };

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

      <div className="w-full p-2">
        {/* Toolbar */}
        <div className="bg-white pl-2 mb-2 flex justify-between items-center">
          <button className="smbut" onClick={() => setIsAddModalOpen(true)}>+ Add Subcategory</button>
        </div>

        {/* Table */}
        <div className="tabst">
          <div>Category</div>
          <div>Subcategories</div>
          <div>Count</div>
        </div>

        <div className="flex flex-col">
          {groupedSubcategories.map((cat) => (
            <div key={cat._id} className="tabc items-start">
              <div className="flex items-center gap-2">
                <img src={`${base_url}${cat.iconpic}`}
                  className="w-[30px] h-[30px] object-cover rounded" alt={cat.catname} />
                <span>{cat.catname}</span>
              </div>
              <div className="flex flex-col gap-1">
                {cat.subs.length === 0 && (
                  <span className="text-gray-400 text-sm">No subcategories</span>
                )}
                {cat.subs.map((subcatObj) => (
                  <div key={subcatObj._id} className="flex items-center gap-2">
                    <span className="text-sm">{subcatObj.subcat}</span>
                    <button className="smbut" onClick={() => handleDeleteSubcategory(subcatObj._id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">{cat.subs.length}</div>
            </div>
          ))}

          {/* Orphan subcategories */}
          {orphans.length > 0 && (
            <div className="tabc items-start">
              <div className="text-red-400 text-sm">Unmatched</div>
              <div className="flex flex-col gap-1">
                {orphans.map(subcatObj => (
                  <div key={subcatObj._id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">({subcatObj.catname})</span>
                    <span className="text-sm">{subcatObj.subcat}</span>
                    <button className="smbut" onClick={() => handleDeleteSubcategory(subcatObj._id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">{orphans.length}</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal title="Add Subcategory" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddPost} className="flex flex-col gap-3">
            <label >
              <span>Category Name</span>
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
            </label>

            <label>
              <span>Subcategory Name</span>
              <input name="subcat" type="text" className="priinput" required />
            </label>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">Add Subcategory</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PSubcategory;