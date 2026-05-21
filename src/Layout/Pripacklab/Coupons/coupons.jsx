import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import { base_url } from "../../../config/config";

const emptyForm = {
  couponname: "", couponcode: "", discount: "", discounttype: "percentage",
  coupontotal: "", coupondate: "", minspent: "", maxamount: "",
};

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(emptyForm);

  useEffect(() => {
    fetch(`${base_url}/couponshow`)
      .then((res) => res.json())
      .then((data) => setCoupons(data))
      .catch((err) => console.error("Error fetching coupons:", err));
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
        fetch(`${base_url}/delcoupon/${_id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Coupon deleted.", "success");
              setCoupons((prev) => prev.filter((c) => c._id !== _id));
            }
          });
      }
    });
  };

  const buildPostData = (form) => ({
    couponname: form.couponname.value.trim(),
    couponcode: form.couponcode.value.trim().toUpperCase(),
    discount: form.discount.value.trim(),
    discounttype: form.discounttype.value,
    coupontotal: form.coupontotal.value.trim(),
    coupondate: form.coupondate.value,
    minspent: form.minspent.value.trim(),
    maxamount: form.maxamount.value.trim(),
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const postData = buildPostData(e.target);
    try {
      const res = await fetch(`${base_url}/addcoupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.insertedId) {
        Swal.fire("Added!", "Coupon added successfully.", "success");
        setCoupons([...coupons, { ...postData, _id: data.insertedId, usedCount: 0, remaining: postData.coupontotal }]);
        e.target.reset();
        setShowAddModal(false);
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleEdit = (coupon) => {
    setEditData(coupon);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedData = buildPostData(e.target);
    try {
      const res = await fetch(`${base_url}/editcoupon/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.message === "Coupon updated successfully") {
        Swal.fire("Updated!", "Coupon updated.", "success");
        setCoupons(coupons.map((c) => c._id === editData._id ? { ...c, ...updatedData } : c));
        setShowEditModal(false);
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const CouponForm = ({ onSubmit, defaultValues = {}, submitLabel }) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flbl">
          <span>Coupon Name</span>
          <input name="couponname" type="text" defaultValue={defaultValues.couponname} className="fflin" placeholder="Summer Sale" required />
        </label>
        <label className="flbl">
          <span>Coupon Code</span>
          <input name="couponcode" type="text" defaultValue={defaultValues.couponcode} className="fflin uppercase" placeholder="SAVE20" required />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flbl">
          <span>Discount Value</span>
          <input name="discount" type="number" defaultValue={defaultValues.discount} className="fflin" placeholder="e.g. 20" required />
        </label>
        <label className="flbl">
          <span>Discount Type</span>
          <select name="discounttype" defaultValue={defaultValues.discounttype || "percentage"} className="fflin" required>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (৳)</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flbl">
          <span>Min. Spent (৳)</span>
          <input name="minspent" type="number" defaultValue={defaultValues.minspent} className="fflin" placeholder="e.g. 500" />
        </label>
        <label className="flbl">
          <span>Max. Discount (৳)</span>
          <input name="maxamount" type="number" defaultValue={defaultValues.maxamount} className="fflin" placeholder="e.g. 200" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flbl">
          <span>Total Coupons</span>
          <input name="coupontotal" type="number" defaultValue={defaultValues.coupontotal} className="fflin" placeholder="e.g. 100" required />
        </label>
        <label className="flbl">
          <span>Deadline</span>
          <input name="coupondate" type="date" defaultValue={defaultValues.coupondate?.slice(0, 10)} className="fflin" required />
        </label>
      </div>

      <button type="submit" className="btn btn-sm btn-primary mt-1 w-full">
        {submitLabel}
      </button>
    </form>
  );

  return (
    <div className="w-full">
      <div className="hdr">Coupons</div>

      <div className="px-6 py-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowAddModal(true)} className="smbut">
            + Add New Coupon
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100">
              <tr className="text-center font-semibold">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Code</th>
                <th className="px-2 py-2">Discount</th>
                <th className="px-2 py-2">Min Spent</th>
                <th className="px-2 py-2">Max Amt</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Used</th>
                <th className="px-2 py-2">Remaining</th>
                <th className="px-2 py-2">Deadline</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-400">No coupons found.</td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="text-center border-b hover:bg-gray-50">
                    <td className="px-2 py-2">{c.couponname}</td>
                    <td className="px-2 py-2">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs tracking-widest">
                        {c.couponcode}
                      </span>
                    </td>
                    <td className="px-2 py-2 font-semibold text-green-700">
                      {c.discounttype === "fixed" ? `৳${c.discount}` : `${c.discount}%`}
                      <span className="ml-1 text-[10px] text-gray-400">
                        ({c.discounttype === "fixed" ? "fixed" : "%"})
                      </span>
                    </td>
                    <td className="px-2 py-2">{c.minspent ? `৳${c.minspent}` : "—"}</td>
                    <td className="px-2 py-2">{c.maxamount ? `৳${c.maxamount}` : "—"}</td>
                    <td className="px-2 py-2">{c.coupontotal}</td>
                    <td className="px-2 py-2 text-blue-600 font-semibold">{c.usedCount || 0}</td>
                    <td className="px-2 py-2 text-green-600 font-semibold">{c.remaining ?? "N/A"}</td>
                    <td className="px-2 py-2">{new Date(c.coupondate).toLocaleDateString("en-GB")}</td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(c)} className="smbut">Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="smbut">Delete</button>
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Coupon</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn"><RiCloseLargeFill /></button>
            </div>
            <CouponForm onSubmit={handleAdd} submitLabel="Add Coupon" />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Coupon</h3>
              <button onClick={() => setShowEditModal(false)} className="close-btn"><RiCloseLargeFill /></button>
            </div>
            <CouponForm onSubmit={handleEditSubmit} defaultValues={editData} submitLabel="Update Coupon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;