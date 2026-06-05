import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  base_url

} from "../../../config/config";
const Advertise = () => {
  const [ima, setIma] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Load advertisements
  useEffect(() => {
    fetch(`${base_url}/advertise`)
      .then((res) => res.json())
      .then((data) => setIma(data))
      .catch((error) => console.error("Error fetching advertisements:", error));
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
    const postData = {
      imglink: form.imglink.value.trim(),
      location: form.location.value.trim(),
      rdlink: form.rdlink.value.trim(),
      tilldate: form.tilldate.value.trim(),
      startdate: form.startdate.value.trim(),
      status: "pending",
      clicks: 0,
      createdAt: new Date(),
    };

    try {
      const response = await fetch(`${base_url}/addadvertise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.insertedId) {
        Swal.fire("Success!", "Advertisement added successfully.", "success");
        form.reset();
        setShowForm(false);
        setIma([...ima, { ...postData, _id: data.insertedId }]);
      } else {
        Swal.fire("Error!", "Failed to add advertisement.", "error");
      }
    } catch (error) {
      console.error("Error adding advertisement:", error);
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
          <img src={ad.imglink} alt="Advert"
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
                <input
                  name="imglink"
                  type="text"
                  placeholder="Image URL"
                  className="priinput"
                  required
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
      </div>
    </div>
  );
};

export default Advertise;
