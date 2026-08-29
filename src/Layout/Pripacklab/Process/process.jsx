import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import { base_url } from "../../../config/config";

const emptyForm = { category: "", step1: "", step1Bn: "", step2: "", step2Bn: "", step3: "", step3Bn: "" };

const Process = () => {
  const [processes, setProcesses] = useState([]);
  const [cats, setCats] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(emptyForm);

  useEffect(() => {
    fetch(`${base_url}/getcat`)
      .then((res) => res.json())
      .then((data) => setCats(data))
      .catch((err) => console.error("Error fetching categories:", err));

    fetch(`${base_url}/process`)
      .then((res) => res.json())
      .then((data) => setProcesses(data))
      .catch((err) => console.error("Error fetching processes:", err));
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
        fetch(`${base_url}/delprocess/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Process deleted.", "success");
              setProcesses((prev) => prev.filter((p) => p._id !== _id));
            }
          });
      }
    });
  };

  const buildData = (form) => ({
    category: form.category.value,
    step1: form.step1.value.trim(),
    step1Bn: form.step1Bn.value.trim(),
    step2: form.step2.value.trim(),
    step2Bn: form.step2Bn.value.trim(),
    step3: form.step3.value.trim(),
    step3Bn: form.step3Bn.value.trim(),
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const postData = buildData(e.target);
    try {
      const res = await fetch(`${base_url}/addprocess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.insertedId) {
        Swal.fire("Added!", "Process added successfully.", "success");
        setProcesses([...processes, { ...postData, _id: data.insertedId }]);
        e.target.reset();
        setShowAddModal(false);
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedData = buildData(e.target);
    try {
      const res = await fetch(`${base_url}/editprocess/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.message === "Process updated successfully") {
        Swal.fire("Updated!", "Process updated.", "success");
        setProcesses(processes.map((p) => p._id === editData._id ? { ...p, ...updatedData } : p));
        setShowEditModal(false);
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const getCatName = (id) => cats.find((c) => c._id === id)?.catname || id;

  const ProcessForm = ({ onSubmit, defaultValues = {}, submitLabel }) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label >
        <span>Category</span>
        <select name="category" defaultValue={defaultValues.category || ""} className="pridrop" required>
          <option value="" disabled>Select category</option>
          {cats.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.catname}</option>
          ))}
        </select>
      </label>
      <label >
        <span>Step 1</span>
        <input name="step1" type="text" defaultValue={defaultValues.step1} className="priinput " placeholder="e.g. Place your order online" required />
      </label>
      <label >
        <span>Step 1 (Bangla)</span>
        <input name="step1Bn" type="text" defaultValue={defaultValues.step1Bn} className="priinput" placeholder="বাংলা" />
      </label>
      <label >
        <span>Step 2</span>
        <input name="step2" type="text" defaultValue={defaultValues.step2} className="priinput" placeholder="e.g. We process and print" required />
      </label>
      <label >
        <span>Step 2 (Bangla)</span>
        <input name="step2Bn" type="text" defaultValue={defaultValues.step2Bn} className="priinput" placeholder="বাংলা" />
      </label>
      <label >
        <span>Step 3</span>
        <input name="step3" type="text" defaultValue={defaultValues.step3} className="priinput" placeholder="e.g. Delivered to your door" required />
      </label>
      <label >
        <span>Step 3 (Bangla)</span>
        <input name="step3Bn" type="text" defaultValue={defaultValues.step3Bn} className="priinput" placeholder="বাংলা" />
      </label>
      <button type="submit" className="pributton">
        {submitLabel}
      </button>
    </form>
  );

  return (
    <div className="w-full">
      <div className="hdr">Ordering Process</div>

      <div className="px-6 py-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowAddModal(true)} className="smbut">
            + Add Process
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100">
              <tr className="text-center font-semibold">
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Step 1</th>
                <th className="px-3 py-2">Step 2</th>
                <th className="px-3 py-2">Step 3</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No processes added yet.
                  </td>
                </tr>
              ) : (
                processes.map((p) => (
                  <tr key={p._id} className="text-center border-b hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {getCatName(p.category)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-left">{p.step1}</td>
                    <td className="px-3 py-2 text-left">{p.step2}</td>
                    <td className="px-3 py-2 text-left">{p.step3}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(p)} className="smbut">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="smbut">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Process</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn"><RiCloseLargeFill /></button>
            </div>
            <ProcessForm onSubmit={handleAdd} submitLabel="Add Process" />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Process</h3>
              <button onClick={() => setShowEditModal(false)} className="close-btn"><RiCloseLargeFill /></button>
            </div>
            <ProcessForm onSubmit={handleEditSubmit} defaultValues={editData} submitLabel="Update Process" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Process;