import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";

const PSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);

  const fetchSellers = () => {
    fetch(`${base_url}/sellers`)
      .then((res) => res.json())
      .then((data) => setSellers(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching sellers:", error));
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const openAddForm = () => {
    setEditingSeller(null);
    setShowForm(true);
  };

  const openEditForm = (seller) => {
    setEditingSeller(seller);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSeller(null);
  };

  const formatServices = (services) => {
    if (Array.isArray(services)) return services.join(", ");
    return services || "";
  };

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
        fetch(`${base_url}/delseller/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "The seller has been deleted.", "success");
              setSellers((prev) => prev.filter((seller) => seller._id !== _id));
            } else {
              Swal.fire("Error!", "Seller was not deleted.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting seller:", error);
            Swal.fire("Error!", "Unexpected error occurred.", "error");
          });
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const services = form.services.value
      .split(",")
      .map((service) => service.trim())
      .filter(Boolean);

    const sellerData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      zilla: form.zilla.value.trim(),
      address: form.address.value.trim(),
      services,
      activetime: form.activetime.value.trim(),
    };

    const password = form.password.value.trim();
    if (!editingSeller || password) {
      sellerData.password = password;
    }

    const url = editingSeller
      ? `${base_url}/editseller/${editingSeller._id}`
      : `${base_url}/addseller`;

    const method = editingSeller ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellerData),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error!", data.message || "Something went wrong.", "error");
        return;
      }

      if (editingSeller) {
        Swal.fire("Updated!", "Seller updated successfully.", "success");
      } else if (data.insertedId) {
        Swal.fire("Added!", "New seller added successfully.", "success");
      }

      form.reset();
      closeForm();
      fetchSellers();
    } catch (error) {
      console.error("Error saving seller:", error);
      Swal.fire("Error!", "Unexpected error occurred.", "error");
    }
  };

  return (
    <div className="w-full">
      <div className="hdr">Sellers</div>

      <div className="relative px-6 py-4">
        <div className="flex justify-end items-center mb-4">
          <button onClick={openAddForm} className="smbut">
            + Add New Seller
          </button>
        </div>

        {/* ===== SELLER TABLE ===== */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead className="bg-gray-100">
              <tr className="text-center font-semibold">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Zilla</th>
                <th>Address</th>
                <th>Services</th>
                <th>Active Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} className="text-center border-b">
                  <td>{seller.name}</td>
                  <td>{seller.email}</td>
                  <td>{seller.phone}</td>
                  <td>{seller.zilla}</td>
                  <td className="truncate max-w-xs">{seller.address}</td>
                  <td className="truncate max-w-xs">{formatServices(seller.services)}</td>
                  <td>{seller.activetime}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditForm(seller)}
                        className="btn btn-xs btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(seller._id)}
                        className="btn btn-xs btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {sellers.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== FLOATING FORM MODAL ===== */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative">
              <button
                onClick={closeForm}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold mb-4 text-center">
                {editingSeller ? "Edit Seller" : "Add New Seller"}
              </h3>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  defaultValue={editingSeller?.name || ""}
                  className="input input-bordered w-full"
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={editingSeller?.email || ""}
                  className="input input-bordered w-full"
                  required
                />

                <input
                  name="phone"
                  type="text"
                  placeholder="Phone"
                  defaultValue={editingSeller?.phone || ""}
                  className="input input-bordered w-full"
                  required
                />

                <input
                  name="password"
                  type="password"
                  placeholder={editingSeller ? "New Password (optional)" : "Password"}
                  className="input input-bordered w-full"
                  required={!editingSeller}
                />

                <input
                  name="zilla"
                  type="text"
                  placeholder="Zilla"
                  defaultValue={editingSeller?.zilla || ""}
                  className="input input-bordered w-full"
                  required
                />

                <input
                  name="activetime"
                  type="text"
                  placeholder="Active Time, e.g. 9 AM - 8 PM"
                  defaultValue={editingSeller?.activetime || ""}
                  className="input input-bordered w-full"
                  required
                />

                <input
                  name="services"
                  type="text"
                  placeholder="Services, comma separated"
                  defaultValue={formatServices(editingSeller?.services)}
                  className="input input-bordered w-full md:col-span-2"
                  required
                />

                <textarea
                  name="address"
                  placeholder="Address"
                  defaultValue={editingSeller?.address || ""}
                  className="textarea textarea-bordered w-full md:col-span-2"
                  required
                />

                <button type="submit" className="btn btn-primary w-full mt-3 md:col-span-2">
                  {editingSeller ? "Update Seller" : "Add Seller"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PSellers;