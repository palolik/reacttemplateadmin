import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import { base_url } from "../../../config/config";
import {FileInput,FileInputEdit} from "../../../utils/FileFields";
const Banners = () => {
  const [banners, setBanners] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [webbannerFile, setWebbannerFile] = useState(null);
  const [phonebannerFile, setPhonebannerFile] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBannerData, setEditBannerData] = useState({
    _id: "", bannername: "", bannerorder: "", webbanner: "", phonebanner: "",
  });
  const [editWebbannerFile, setEditWebbannerFile] = useState(null);
  const [editPhonebannerFile, setEditPhonebannerFile] = useState(null);

  const fetchBanners = () => {
    fetch(`${base_url}/getbanners`)
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((error) => console.error("Error fetching banners:", error));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?", text: "This action cannot be undone!",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/delbanner/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Banner deleted successfully.", "success");
              setBanners(banners.filter((b) => b._id !== _id));
            }
          })
          .catch((error) => console.error("Error deleting banner:", error));
      }
    });
  };

  const handleAddBanner = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData();
    formData.append("bannername", form.bannername.value.trim());
    formData.append("bannerorder", form.bannerorder.value.trim());
    if (webbannerFile) formData.append("webbanner", webbannerFile);
    if (phonebannerFile) formData.append("phonebanner", phonebannerFile);

    try {
      const response = await fetch(`${base_url}/addbanner`, { method: "POST", body: formData });
      const data = await response.json();
      if (data.insertedId) {
        Swal.fire("Added!", "New banner added successfully!", "success");
        form.reset();
        setWebbannerFile(null);
        setPhonebannerFile(null);
        setIsAddModalOpen(false);
        fetchBanners();
      }
    } catch (error) {
      console.error("Error adding banner:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleEdit = (banner) => {
    setEditBannerData(banner);
    setEditWebbannerFile(null);
    setEditPhonebannerFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData();
    formData.append("bannername", form.bannername.value.trim());
    formData.append("bannerorder", form.bannerorder.value.trim());
    if (editWebbannerFile) formData.append("webbanner", editWebbannerFile);
    if (editPhonebannerFile) formData.append("phonebanner", editPhonebannerFile);

    try {
      const response = await fetch(`${base_url}/editbanner/${editBannerData._id}`, { method: "PUT", body: formData });
      const data = await response.json();
      if (data.message === "Category updated successfully") {
        Swal.fire("Updated!", "Banner updated successfully!", "success").then(() => {
          setBanners(banners.map((b) => b._id === editBannerData._id ? { ...b, ...data.updatedCategory } : b));
          setIsEditModalOpen(false);
        });
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseLargeFill />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="hdr">Banners</div>

      <div className="w-full p-2">
        {/* Toolbar */}
        <div className="bg-white pl-2 mb-2 flex justify-between items-center">
          <button className="smbut" onClick={() => setIsAddModalOpen(true)}>+ Add Banner</button>
        </div>

        {/* Table */}
        <div className="tabst">
          <div>Banner Name</div>
          <div>Order</div>
          <div>Web Banner</div>
          <div>Phone Banner</div>
          <div>Action</div>
        </div>

        <div className="flex flex-col">
          {banners.map((banner) => (
            <div key={banner._id} className="tabc">
              <div>{banner.bannername}</div>
              <div>{banner.bannerorder}</div>
              <div>
                {banner.webbanner && (
                  <img className="w-[120px] h-[45px] object-cover rounded"
                    src={`${base_url}${banner.webbanner}`} alt="Web Banner" />
                )}
              </div>
              <div>
                {banner.phonebanner && (
                  <img className="w-[45px] h-[70px] object-cover rounded"
                    src={`${base_url}${banner.phonebanner}`} alt="Phone Banner" />
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(banner)} className="smbut">Edit</button>
                <button onClick={() => handleDelete(banner._id)} className="smbut">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal title="Add Banner" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddBanner} className="flex flex-col gap-3">
            <label >
              <span>Banner Name</span>
              <input name="bannername" type="text" className="priinput" required />
            </label>
            <label >
              <span>Banner Order</span>
              <input name="bannerorder" type="number" className="priinput" required />
            </label>
          <FileInput
  label="Web Banner"
  file={webbannerFile}
  onChange={(e) => setWebbannerFile(e.target.files[0])}
/>

<FileInput
  label="Phone Banner"
  file={phonebannerFile}
  onChange={(e) => setPhonebannerFile(e.target.files[0])}
/>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">Add Banner</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

    {isEditModalOpen && (
  <Modal title="Edit Banner" onClose={() => setIsEditModalOpen(false)}>
    <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
      <label>
        <span>Banner Name</span>
        <input name="bannername" defaultValue={editBannerData.bannername}
          type="text" className="priinput" required />
      </label>
      <label>
        <span>Banner Order</span>
        <input name="bannerorder" defaultValue={editBannerData.bannerorder}
          type="number" className="priinput" required />
      </label>

      <FileInputEdit
        label="Web Banner"
        file={editWebbannerFile}
        existingUrl={editBannerData.webbanner}
        onChange={(e) => setEditWebbannerFile(e.target.files[0])}
        previewClass="w-[140px] h-[50px]"
      />

      <FileInputEdit
        label="Phone Banner"
        file={editPhonebannerFile}
        existingUrl={editBannerData.phonebanner}
        onChange={(e) => setEditPhonebannerFile(e.target.files[0])}
        previewClass="w-[50px] h-[80px]"
      />

      <div className="flex gap-2 mt-2">
        <button type="submit" className="pributton flex-1">Update Banner</button>
        <button type="button" onClick={() => setIsEditModalOpen(false)}
          className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
      </div>
    </form>
  </Modal>
)}
    </div>
  );
};

export default Banners;

