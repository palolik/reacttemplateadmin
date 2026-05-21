import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import { base_url } from "../../../config/config";

const emptyForm = { area: "", charge: "", period: "", servicecategory: "" };

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [cats, setCats] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(emptyForm);

  useEffect(() => {
    fetch(`${base_url}/getcat`)
      .then((res) => res.json())
      .then((data) => setCats(data))
      .catch((err) => console.error("Error fetching categories:", err));

    fetch(`${base_url}/delivery`)
      .then((res) => res.json())
      .then((data) => setDeliveries(data))
      .catch((err) => console.error("Error fetching delivery charges:", err));
  }, []);

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
        fetch(`${base_url}/deldelivery/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Delivery charge deleted.", "success");
              setDeliveries((prev) => prev.filter((d) => d._id !== _id));
            }
          });
      }
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const postData = {
      area: form.area.value.trim(),
      charge: form.charge.value.trim(),
      period: form.period.value.trim(),
      servicecategory: form.servicecategory.value,
    };
    try {
      const res = await fetch(`${base_url}/adddelivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.insertedId) {
        Swal.fire("Added!", "Delivery charge added.", "success");
        setDeliveries([...deliveries, { ...postData, _id: data.insertedId }]);
        form.reset();
        setShowAddModal(false);
      }
    } catch (err) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      area: form.area.value.trim(),
      charge: form.charge.value.trim(),
      period: form.period.value.trim(),
      servicecategory: form.servicecategory.value,
    };
    try {
      const res = await fetch(`${base_url}/editdelivery/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.message === "Delivery updated successfully") {
        Swal.fire("Updated!", "Delivery charge updated.", "success");
        setDeliveries(
          deliveries.map((d) =>
            d._id === editData._id ? { ...d, ...updatedData } : d
          )
        );
        setShowEditModal(false);
      }
    } catch (err) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const getCatName = (id) => {
    const cat = cats.find((c) => c._id === id);
    return cat ? cat.catname : id;
  };

  const DeliveryForm = ({ onSubmit, defaultValues = {}, submitLabel }) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flbl">
        <span>Area</span>
        <input
          name="area"
          type="text"
          defaultValue={defaultValues.area}
          className="fflin"
          placeholder="e.g. Dhaka City"
          required
        />
      </label>
      <label className="flbl">
        <span>Charge (৳)</span>
        <input
          name="charge"
          type="number"
          defaultValue={defaultValues.charge}
          className="fflin"
          placeholder="e.g. 60"
          required
        />
      </label>
      <label className="flbl">
        <span>Delivery Period</span>
        <input
          name="period"
          type="text"
          defaultValue={defaultValues.period}
          className="fflin"
          placeholder="e.g. 1-2 days"
          required
        />
      </label>
      <label className="flbl">
        <span>Service Category</span>
        <select
          name="servicecategory"
          defaultValue={defaultValues.servicecategory || ""}
          className="fflin"
          required
        >
          <option value="" disabled>Select category</option>
          {cats.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.catname}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-sm btn-primary mt-2 w-full">
        {submitLabel}
      </button>
    </form>
  );

  return (
    <div className="w-full">
      <div className="hdr">Delivery Charges</div>

      <div className="px-6 py-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowAddModal(true)} className="smbut">
            + Add Delivery Charge
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100">
              <tr className="text-center font-semibold">
                <th className="px-3 py-2">Area</th>
                <th className="px-3 py-2">Charge (৳)</th>
                <th className="px-3 py-2">Period</th>
                <th className="px-3 py-2">Service Category</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No delivery charges added yet.
                  </td>
                </tr>
              ) : (
                deliveries.map((d) => (
                  <tr key={d._id} className="text-center border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{d.area}</td>
                    <td className="px-3 py-2 font-semibold text-green-700">৳{d.charge}</td>
                    <td className="px-3 py-2">{d.period}</td>
                    <td className="px-3 py-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {getCatName(d.servicecategory)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(d)} className="smbut">Edit</button>
                        <button onClick={() => handleDelete(d._id)} className="smbut">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Delivery Charge</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn">
                <RiCloseLargeFill />
              </button>
            </div>
            <DeliveryForm onSubmit={handleAdd} submitLabel="Add Charge" />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Delivery Charge</h3>
              <button onClick={() => setShowEditModal(false)} className="close-btn">
                <RiCloseLargeFill />
              </button>
            </div>
            <DeliveryForm onSubmit={handleEditSubmit} defaultValues={editData} submitLabel="Update Charge" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;