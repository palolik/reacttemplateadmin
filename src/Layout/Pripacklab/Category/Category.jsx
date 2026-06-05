import "../../../styles/productview.css";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import { FileInput, FileInputEdit } from "../../../utils/FileFields";

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

const PCategory = () => {
  const loadercats = useLoaderData([]);
  const [cats, setCats] = useState(loadercats);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pagecoverFile, setPagecoverFile] = useState(null);
  const [iconpicFile, setIconpicFile] = useState(null);
  const [homepicFile, setHomepicFile] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCatData, setEditCatData] = useState({ _id: "", catname: "", pagecover: "", iconpic: "", homepic: "" });
  const [editPagecoverFile, setEditPagecoverFile] = useState(null);
  const [editIconpicFile, setEditIconpicFile] = useState(null);
  const [editHomepicFile, setEditHomepicFile] = useState(null);

  useEffect(() => {
    fetch(`${base_url}/cat`)
      .then((res) => res.json())
      .then((data) => setCats(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?", text: "This action cannot be undone!",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/delcat/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Category deleted successfully.", "success");
              setCats(cats.filter((cat) => cat._id !== _id));
            }
          });
      }
    });
  };

  const handleAddPost = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData();
    formData.append("catname", form.catname.value.trim());
    if (pagecoverFile) formData.append("pagecover", pagecoverFile);
    if (iconpicFile) formData.append("iconpic", iconpicFile);
    if (homepicFile) formData.append("homepic", homepicFile);

    try {
      const response = await fetch(`${base_url}/addcat`, { method: "POST", body: formData });
      const data = await response.json();
      if (data.insertedId) {
        Swal.fire("Added!", "New category added successfully!", "success");
        form.reset();
        setPagecoverFile(null);
        setIconpicFile(null);
        setHomepicFile(null);
        setIsAddModalOpen(false);
        fetch(`${base_url}/cat`).then(r => r.json()).then(setCats);
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleEdit = (cat) => {
    setEditCatData(cat);
    setEditPagecoverFile(null);
    setEditIconpicFile(null);
    setEditHomepicFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditPost = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData();
    formData.append("catname", form.catname.value.trim());
    if (editPagecoverFile) formData.append("pagecover", editPagecoverFile);
    if (editIconpicFile) formData.append("iconpic", editIconpicFile);
    if (editHomepicFile) formData.append("homepic", editHomepicFile);

    try {
      const response = await fetch(`${base_url}/editcat/${editCatData._id}`, { method: "PUT", body: formData });
      const data = await response.json();
      if (data.message === "Category updated successfully") {
        Swal.fire("Updated!", "Category updated successfully!", "success").then(() => {
          setCats(cats.map((cat) => cat._id === editCatData._id ? { ...cat, ...editCatData } : cat));
          setIsEditModalOpen(false);
        });
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full">
      <div className="hdr">Category</div>

      <div className="w-full p-2">
        {/* Toolbar */}
        <div className="bg-white pl-2 mb-2 flex justify-between items-center">
          <button className="smbut" onClick={() => setIsAddModalOpen(true)}>+ Add Category</button>
        </div>

        {/* Table */}
        <div className="tabst">
          <div>Category</div>
          <div>Cover</div>
          <div>Icon</div>
          <div>Home Cover</div>
          <div>Action</div>
        </div>

        <div className="flex flex-col">
          {cats.map((cat) => (
            <div key={cat._id} className="tabc">
              <div>{cat.catname}</div>
              <div><img className="w-[100px] h-[40px] object-cover rounded" src={`${base_url}${cat.pagecover}`} alt="Cover" /></div>
              <div><img className="w-[40px] h-[40px] object-cover rounded" src={`${base_url}${cat.iconpic}`} alt="Icon" /></div>
              <div><img className="w-[100px] h-[40px] object-cover rounded" src={`${base_url}${cat.homepic}`} alt="Home" /></div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(cat)} className="smbut">Edit</button>
                <button onClick={() => handleDelete(cat._id)} className="smbut">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal title="Add Category" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddPost} className="flex flex-col gap-3">
            <label className="lbl">
              <span>Category Name</span>
              <input name="catname" type="text" className="priinput" required />
            </label>
            <FileInput label="Cover Picture" file={pagecoverFile}
              onChange={(e) => setPagecoverFile(e.target.files[0])} />
            <FileInput label="Icon Picture" file={iconpicFile}
              onChange={(e) => setIconpicFile(e.target.files[0])} />
            <FileInput label="Home Picture" file={homepicFile}
              onChange={(e) => setHomepicFile(e.target.files[0])} />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">Add Category</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal title="Edit Category" onClose={() => setIsEditModalOpen(false)}>
          <form onSubmit={handleEditPost} className="flex flex-col gap-3">
            <label className="lbl">
              <span>Category Name</span>
              <input name="catname" defaultValue={editCatData.catname} type="text" className="priinput" required />
            </label>
            <FileInputEdit label="Cover Picture" file={editPagecoverFile}
              existingUrl={editCatData.pagecover} previewClass="w-[160px] h-[60px]"
              onChange={(e) => setEditPagecoverFile(e.target.files[0])} />
            <FileInputEdit label="Icon Picture" file={editIconpicFile}
              existingUrl={editCatData.iconpic} previewClass="w-[50px] h-[50px]"
              onChange={(e) => setEditIconpicFile(e.target.files[0])} />
            <FileInputEdit label="Home Picture" file={editHomepicFile}
              existingUrl={editCatData.homepic} previewClass="w-[160px] h-[60px]"
              onChange={(e) => setEditHomepicFile(e.target.files[0])} />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">Update Category</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PCategory;