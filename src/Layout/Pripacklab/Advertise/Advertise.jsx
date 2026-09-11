import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import {
  base_url

} from "../../../config/config";
import { FileInput, FileInputEdit } from "../../../utils/FileFields";
const Advertise = () => {
  const [ima, setIma] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAdData, setEditAdData] = useState({
    _id: "", imglink: "", location: "", rdlink: "", startdate: "", tilldate: "",
  });
  const [editImageFile, setEditImageFile] = useState(null);

  const fetchAdvertisements = () => {
    fetch(`${base_url}/advertise`)
      .then((res) => res.json())
      .then((data) => setIma(data))
      .catch((error) => console.error("Error fetching advertisements:", error));
  };

  // Load advertisements
  useEffect(() => {
    fetchAdvertisements();
  }, []);


  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/deladvertise/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
              setIma((prev) => prev.filter((item) => item._id !== _id));
            }
          })
          .catch((error) => console.error("Error deleting advertisement:", error));
      }
    });
  };

  const handleAddPost = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!imageFile) {
      Swal.fire("Error!", "Please choose an advertisement image.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("location", form.location.value.trim());
    formData.append("rdlink", form.rdlink.value.trim());
    formData.append("startdate", form.startdate.value.trim());
    formData.append("tilldate", form.tilldate.value.trim());
    formData.append("image", imageFile);

    try {
      const response = await fetch(`${base_url}/addadvertise`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.insertedId) {
        Swal.fire("Success!", "Advertisement added successfully.", "success");
        form.reset();
        setImageFile(null);
        setShowForm(false);
        fetchAdvertisements();
      } else {
        Swal.fire("Error!", "Failed to add advertisement.", "error");
      }
    } catch (error) {
      console.error("Error adding advertisement:", error);
      Swal.fire("Error!", "Unexpected error occurred.", "error");
    }
  };

  const handleEdit = (ad) => {
    setEditAdData(ad);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append("location", form.location.value.trim());
    formData.append("rdlink", form.rdlink.value.trim());
    formData.append("startdate", form.startdate.value.trim());
    formData.append("tilldate", form.tilldate.value.trim());
    if (editImageFile) formData.append("image", editImageFile);

    try {
      const response = await fetch(`${base_url}/editadvertise/${editAdData._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (data.message === "Advertisement updated successfully") {
        Swal.fire("Updated!", "Advertisement updated successfully.", "success").then(() => {
          setIma((prev) =>
            prev.map((ad) =>
              ad._id === editAdData._id ? { ...ad, ...data.updatedAdvertise } : ad
            )
          );
          setIsEditModalOpen(false);
        });
      } else {
        Swal.fire("Error!", "Failed to update advertisement.", "error");
      }
    } catch (error) {
      console.error("Error updating advertisement:", error);
      Swal.fire("Error!", "Unexpected error occurred.", "error");
    }
  };
  const handleStatusChange = (adId, newStatus) => {
    fetch(`${base_url}/adstatus/${adId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0 || data.acknowledged) {
          Swal.fire({
            icon: "success",
            title: "Status Updated!",
            text: `Status changed to ${newStatus}`,
            timer: 1200,
            showConfirmButton: false,
          });

          setIma((prev) =>
            prev.map((ad) =>
              ad._id === adId ? { ...ad, status: newStatus } : ad
            )
          );
        } else {
          Swal.fire({
            icon: "info",
            title: "No Changes",
            text: "Status was already set to this value.",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Could not update status.",
        });
      });
  };

  return (
    <div className="w-full">
      <div className="hdr">Advertisement</div>

      <div className="relative px-6 py-4">
        <div className="flex justify-end items-center mb-4">
          <button onClick={() => setShowForm(true)} className="smbut">
            + Add New Advertisement
          </button>
        </div>

     <div className="overflow-x-auto">
  <div className="tabst">
    <div>Image</div>
    <div>Location</div>
    <div>Redirect Link</div>
    <div>Start Date</div>
    <div>Till Date</div>
    <div>Clicks</div>
    <div>Status</div>
    <div>Change Status</div>
    <div>Actions</div>
  </div>

  <div className="flex flex-col">
    {ima.length === 0 && (
      <div className="text-center text-gray-400 py-8">No advertisements found.</div>
    )}
    {ima.map((ad) => (
      <div key={ad._id} className="tabc">
        <div>
          <img src={`${base_url}${ad.imglink}`} alt="Advert"
            className="w-12 h-12 object-cover rounded-full" />
        </div>
        <div>{ad.location}</div>
        <div className="truncate max-w-xs">
          <a href={ad.rdlink} target="_blank" rel="noopener noreferrer"
            className="text-blue-600 underline">{ad.rdlink}</a>
        </div>
        <div>{ad.startdate}</div>
        <div>{ad.tilldate}</div>
        <div>{ad.clicks}</div>
        <div>{ad.status}</div>
        <div>
          <select
            value={ad.status || "pending"}
            onChange={(e) => handleStatusChange(ad._id, e.target.value)}
            className={`border rounded px-2 py-1 text-sm cursor-pointer ${
              ad.status === "approved" ? "bg-green-100 text-green-800"
              : ad.status === "rejected" ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex gap-1">
          <button onClick={() => handleEdit(ad)} className="smbut">Edit</button>
          <button onClick={() => handleDelete(ad._id)} className="smbut">Delete</button>
        </div>
      </div>
    ))}
  </div>
</div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Add Advertisement
              </h3>
              <form onSubmit={handleAddPost} className="flex flex-col gap-3">
                <FileInput
                  label="Advertisement Image"
                  file={imageFile}
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <select
                  name="location"
                  className="pridrop"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Ad Location
                  </option>
                  <option value="Header">Header</option>
                  <option value="hls">home left Sidebar</option>
                  <option value="hrs">home right Sidebar</option>
                  <option value="Footer">Footer</option>
                  <option value="Homepage Banner">Homepage Banner</option>
                  <option value="Popup">Popup</option>
                </select>
                <input
                  name="rdlink"
                  type="text"
                  placeholder="Redirect Link"
                  className="priinput"
                  required
                />
                <input
                  name="startdate"
                  type="date"
                  className="priinput"
                  required
                />
                <input
                  name="tilldate"
                  type="date"
                  className="priinput text-black"
                  required
                />
                <button type="submit" className="pributton">
                  Add Advertisement
                </button>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                <RiCloseLargeFill />
              </button>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Edit Advertisement
              </h3>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                <FileInputEdit
                  label="Advertisement Image"
                  file={editImageFile}
                  existingUrl={editAdData.imglink}
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  previewClass="w-[160px] h-[60px]"
                />
                <select
                  name="location"
                  className="pridrop"
                  required
                  defaultValue={editAdData.location}
                >
                  <option value="" disabled>
                    Select Ad Location
                  </option>
                  <option value="Header">Header</option>
                  <option value="hls">home left Sidebar</option>
                  <option value="hrs">home right Sidebar</option>
                  <option value="Footer">Footer</option>
                  <option value="Homepage Banner">Homepage Banner</option>
                  <option value="Popup">Popup</option>
                </select>
                <input
                  name="rdlink"
                  type="text"
                  defaultValue={editAdData.rdlink}
                  placeholder="Redirect Link"
                  className="priinput"
                  required
                />
                <input
                  name="startdate"
                  type="date"
                  defaultValue={editAdData.startdate}
                  className="priinput"
                  required
                />
                <input
                  name="tilldate"
                  type="date"
                  defaultValue={editAdData.tilldate}
                  className="priinput text-black"
                  required
                />
                <button type="submit" className="pributton">
                  Update Advertisement
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advertise;
