import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import { base_url } from "../../../config/config";

const Banners = () => {
  const [banners, setBanners] = useState([]);

  // Add form state
  const [webbannerFile, setWebbannerFile] = useState(null);
  const [phonebannerFile, setPhonebannerFile] = useState(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBannerData, setEditBannerData] = useState({
    _id: "",
    bannername: "",
    bannerorder: "",
    webbanner: "",
    phonebanner: "",
  });
  const [editWebbannerFile, setEditWebbannerFile] = useState(null);
  const [editPhonebannerFile, setEditPhonebannerFile] = useState(null);

  // Fetch all banners
  useEffect(() => {
    fetch(`${base_url}/getbanners`)
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((error) => console.error("Error fetching banners:", error));
  }, []);

  // Delete banner
  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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

  // Add banner
  const handleAddBanner = async (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append("bannername", form.bannername.value.trim());
    formData.append("bannerorder", form.bannerorder.value.trim());
    if (webbannerFile) formData.append("webbanner", webbannerFile);
    if (phonebannerFile) formData.append("phonebanner", phonebannerFile);

    try {
      const response = await fetch(`${base_url}/addbanner`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.insertedId) {
        Swal.fire("Added!", "New banner added successfully!", "success");
        form.reset();
        setWebbannerFile(null);
        setPhonebannerFile(null);
        // Refresh list
        fetch(`${base_url}/getbanners`)
          .then((res) => res.json())
          .then((data) => setBanners(data));
      }
    } catch (error) {
      console.error("Error adding banner:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Open edit modal
  const handleEdit = (banner) => {
    setEditBannerData(banner);
    setEditWebbannerFile(null);
    setEditPhonebannerFile(null);
    setIsEditModalOpen(true);
  };

  // Submit edit
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append("bannername", form.bannername.value.trim());
    formData.append("bannerorder", form.bannerorder.value.trim());
    if (editWebbannerFile) formData.append("webbanner", editWebbannerFile);
    if (editPhonebannerFile) formData.append("phonebanner", editPhonebannerFile);

    try {
      const response = await fetch(`${base_url}/editbanner/${editBannerData._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (data.message === "Category updated successfully") {
        Swal.fire("Updated!", "Banner updated successfully!", "success").then(() => {
          setBanners(
            banners.map((b) =>
              b._id === editBannerData._id
                ? { ...b, ...data.updatedCategory }
                : b
            )
          );
          setIsEditModalOpen(false);
        });
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full">
      <div className="hdr">Banners</div>

      <div className="flex flex-row p-2 w-full">
        {/* ---- ADD FORM ---- */}
        <div className="flex flex-col gap-4 p-2 w-[350px]">
          <form onSubmit={handleAddBanner}>
            <label className="lbl">
              <span>Banner Name</span>
              <input name="bannername" type="text" className="flin" required />
            </label>

            <label className="lbl">
              <span>Banner Order</span>
              <input name="bannerorder" type="number" className="flin" required />
            </label>

            <label className="lbl">
              <span>Web Banner</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setWebbannerFile(e.target.files[0])}
              />
              {webbannerFile && (
                <img
                  src={URL.createObjectURL(webbannerFile)}
                  className="w-[160px] h-[60px] mt-2 rounded shadow object-cover"
                  alt="Web Banner Preview"
                />
              )}
            </label>

            <label className="lbl">
              <span>Phone Banner</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhonebannerFile(e.target.files[0])}
              />
              {phonebannerFile && (
                <img
                  src={URL.createObjectURL(phonebannerFile)}
                  className="w-[80px] h-[120px] mt-2 rounded shadow object-cover"
                  alt="Phone Banner Preview"
                />
              )}
            </label>

            <button type="submit" className="btn mt-10 btn-sm w-[200px]">
              Add Banner
            </button>
          </form>
        </div>

        {/* ---- TABLE ---- */}
        <div className="w-full p-2">
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
                    <img
                      className="w-[120px] h-[45px] object-cover rounded"
                      src={`${base_url}${banner.webbanner}`}
                      alt="Web Banner"
                    />
                  )}
                </div>

                <div>
                  {banner.phonebanner && (
                    <img
                      className="w-[45px] h-[70px] object-cover rounded"
                      src={`${base_url}${banner.phonebanner}`}
                      alt="Phone Banner"
                    />
                  )}
                </div>

                <div>
                  <button onClick={() => handleEdit(banner)} className="smbut">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="smbut">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- EDIT MODAL ---- */}
      {isEditModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-[#0000001e]">
          <div className="bg-white p-5 w-[400px] rounded-md relative">
            <div className="flex justify-between items-center mb-3">
              <h2>Edit Banner</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="close-btn">
                <RiCloseLargeFill />
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="flex flex-col justify-center items-center"
            >
              <label className="flbl">
                <span>Banner Name</span>
                <input
                  name="bannername"
                  defaultValue={editBannerData.bannername}
                  type="text"
                  className="fflin"
                  required
                />
              </label>

              <label className="flbl">
                <span>Banner Order</span>
                <input
                  name="bannerorder"
                  defaultValue={editBannerData.bannerorder}
                  type="number"
                  className="fflin"
                  required
                />
              </label>

              <label className="flbl">
                <span>Web Banner</span>
                {editBannerData.webbanner && !editWebbannerFile && (
                  <img
                    src={`${base_url}${editBannerData.webbanner}`}
                    className="w-[140px] h-[50px] mb-1 rounded shadow object-cover"
                    alt="Current Web Banner"
                  />
                )}
                {editWebbannerFile && (
                  <img
                    src={URL.createObjectURL(editWebbannerFile)}
                    className="w-[140px] h-[50px] mb-1 rounded shadow object-cover"
                    alt="New Web Banner Preview"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="fflin"
                  onChange={(e) => setEditWebbannerFile(e.target.files[0])}
                />
              </label>

              <label className="flbl">
                <span>Phone Banner</span>
                {editBannerData.phonebanner && !editPhonebannerFile && (
                  <img
                    src={`${base_url}${editBannerData.phonebanner}`}
                    className="w-[50px] h-[80px] mb-1 rounded shadow object-cover"
                    alt="Current Phone Banner"
                  />
                )}
                {editPhonebannerFile && (
                  <img
                    src={URL.createObjectURL(editPhonebannerFile)}
                    className="w-[50px] h-[80px] mb-1 rounded shadow object-cover"
                    alt="New Phone Banner Preview"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="fflin"
                  onChange={(e) => setEditPhonebannerFile(e.target.files[0])}
                />
              </label>

              <button type="submit" className="btn mt-10 btn-sm w-[200px]">
                Update Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;