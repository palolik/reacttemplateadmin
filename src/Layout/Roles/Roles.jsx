import '../../styles/productview.css';
import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { base_url } from '../../config/config';
const Roles = () => {
  const loaderroles = useLoaderData([]);
  const [rolesDat, setroles] = useState(loaderroles);
  const [isEditing, setIsEditing] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  
  // Available tabs for multi-select
  const availableTabs = ["skillnup", "sorders", "ecommerce","eorders", "pripacklab" , "marketing", "accounts", "roles" , "ccinvestment" ];

  // Role form state
  const [role, setRole] = useState({
    rname: "",
    remail: "",
    rphone: "",
    pass: "",
    tabs: [],
    status: "Active"
  });

  // Fetch roles from backend
  const fetchRoles = () => {
    fetch(`${base_url}/getroles`)
      .then(res => res.json())
      .then(data => setroles(data))
      .catch(error => console.error('Error fetching roles:', error));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, options, type } = e.target;

    if (type === "select-multiple") {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setRole(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setRole(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRole = async (event) => {
    event.preventDefault();
    const postData = { ...role };
  
    try {
      const url = isEditing
        ? `${base_url}/updaterole/${editRoleId}`
        : `${base_url}/addroles`;
  
      const method = isEditing ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
  
      const data = await response.json();
  
      if ((isEditing && data.modifiedCount > 0) || (!isEditing && data.insertedId)) {
        Swal.fire(
          isEditing ? "Role Updated!" : "New Role Added!",
          isEditing ? "Role has been successfully updated." : "You have successfully added a new role.",
          "success"
        );
        setRole({
          rname: "",
          remail: "",
          rphone: "",
          pass: "",
          tabs: [],
          status: "Active"
        });
        setIsEditing(false);
        setEditRoleId(null);
        fetchRoles(); // Refresh list
      } else {
        Swal.fire("Error!", "There was an issue submitting the form.", "error");
      }
    } catch (error) {
      console.error('Error submitting role:', error);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };
  
const handleDelete = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(`${base_url}/deleterole/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.deletedCount > 0) {
        Swal.fire("Deleted!", "Role has been deleted.", "success");
        fetchRoles(); // Refresh list
      } else {
        Swal.fire("Error", "Failed to delete role.", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "An error occurred during deletion.", "error");
    }
  }
};

const handleEditClick = (roleItem) => {
  setIsEditing(true);
  setEditRoleId(roleItem._id);
  setRole({
    rname: roleItem.rname,
    remail: roleItem.remail,
    rphone: roleItem.rphone,
    pass: roleItem.pass,
    tabs: roleItem.tabs || [],
    status: roleItem.status,
  });
};


  return (
    <div className='w-full'>
      <div className='hdr'>Roles</div>
      <div className="flex flex-row p-2 w-full">
        
        {/* Form Section */}
        <div className="flex flex-col gap-4 p-2 w-[350px]">
          <form onSubmit={handleAddRole}>
            <label className="lbl">
              <div><span>Name</span></div>
              <input
                type="text"
                name="rname"
                  className="grow"
                placeholder="Type here"
                value={role.rname}
                onChange={handleInputChange}
              />
            </label>

            <label className="lbl">
              <div><span>Email</span></div>
              <input
                type="text"
                name="remail"
                  className="grow"
                placeholder="Type here"
                value={role.remail}
                onChange={handleInputChange}
              />
            </label>

            <label className="lbl">
              <div><span>Phone</span></div>
              <input
                type="text"
                name="rphone"
                  className="grow"
                placeholder="Type here"
                value={role.rphone}
                onChange={handleInputChange}
              />
            </label>

            <label className="lbl">
              <div><span>Password</span></div>
              <input
                type="text"
                name="pass"
                  className="grow"
                placeholder="Type here"
                value={role.pass}
                onChange={handleInputChange}
              />
            </label>

            <label className="lbl">
              <div><span>Tab access</span></div>
              <select
                name="tabs"
                multiple
                value={role.tabs}
                onChange={handleInputChange}
                className="h-[150px] p-2 grow"
              >
                {availableTabs.map(tab => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </label>

            <label className="lbl">
              <div><span>Status</span></div>
              <select
               className="grow"
                name="status"
                value={role.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>

            <button type="submit" className='btn mt-10 btn-sm w-[200px]'>Add New Role</button>
            {isEditing && (
  <button
    type="button"
    onClick={() => {
      setIsEditing(false);
      setEditRoleId(null);
      setRole({
        rname: "",
        remail: "",
        rphone: "",
        pass: "",
        tabs: [],
        status: "Active"
      });
    }}
    className='btn btn-sm w-[200px] mt-2 bg-red-500 text-white'
  >
    Cancel Edit
  </button>
)}

          </form>
        </div>

        {/* Table Section */}
        <div className="w-full p-2">
          <div className="tabst">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Pass</div>
            <div>Tab access</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          <div className="flex flex-col">
            {rolesDat.map((roleItem, index) => (
              <div key={index} className="tabc">
                <div><p>{roleItem.rname}</p></div>
                <div><p>{roleItem.remail}</p></div>
                <div><p>{roleItem.rphone}</p></div>
                <div><p>{roleItem.pass}</p></div>
                <div><p>{(roleItem.tabs || []).join(", ")}</p></div>
                <div><p>{roleItem.status}</p></div>
                <div>
                <button className="smbut" onClick={() => handleEditClick(roleItem)}>Edit</button>

                  <button className="smbut" onClick={() => handleDelete(roleItem._id)}>Delete</button>
                  </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Roles;
