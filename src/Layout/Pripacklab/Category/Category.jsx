import "../../../styles/productview.css";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { RiCloseLargeFill } from "react-icons/ri";
import { base_url } from "../../../config/config";
const PCategory = () => {
  const loadercats = useLoaderData([]);
  const [cats, setCats] = useState(loadercats);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCatData, setEditCatData] = useState({
    _id: "",
    catname: "",
    pagecover: "",
    iconpic: "",
    homepic: "",
  });

  const [pagecoverFile, setPagecoverFile] = useState(null);
  const [iconpicFile, setIconpicFile] = useState(null);
  const [homepicFile, setHomepicFile] = useState(null);

  // Image states for Edit Form
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
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/delcat/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Category deleted successfully.", "success");
              setCats(cats.filter((cat) => cat._id !== _id));
            }
          })
          .catch((error) => console.error("Error deleting cat:", error));
      }
    });
  };

  // -------------------- ADD CATEGORY --------------------
  const handleAddPost = async (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append("catname", form.catname.value.trim());
    formData.append("pagecover", pagecoverFile);
    formData.append("iconpic", iconpicFile);
    formData.append("homepic", homepicFile);

    try {
      const response = await fetch(`${base_url}/addcat`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.insertedId) {
        Swal.fire("Added!", "New category added successfully!", "success");
        form.reset();
        setPagecoverFile(null);
        setIconpicFile(null);
        setHomepicFile(null);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleEdit = (cat) => {
    setEditCatData(cat);
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
      const response = await fetch(
        `${base_url}/editcat/${editCatData._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if  (data.message === "Category updated successfully")  {
        Swal.fire("Updated!", "Category updated successfully!", "success").then(
          () => {
            setCats(
              cats.map((cat) =>
                cat._id === editCatData._id
                  ? { ...cat, ...editCatData }
                  : cat
              )
            );
            setIsEditModalOpen(false);
          }
        );
      }
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full">
      <div className="hdr">Category</div>

      <div className="flex flex-row p-2 w-full">
        <div className="flex flex-col gap-4 p-2 w-[350px]">
          <form onSubmit={handleAddPost}>
         <label className="lbl">
  <span>Category Name</span>
  <input name="catname" type="text" className="flin" />
</label>

<label className="lbl">
  <span>Pick Cover Picture</span>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setPagecoverFile(e.target.files[0])}
  />

  {pagecoverFile && (
    <img
      src={URL.createObjectURL(pagecoverFile)}
      className="w-[120px] h-[60px] mt-2 rounded shadow"
      alt="Cover Preview"
    />
  )}
</label>

{/* Icon Picture */}
<label className="lbl">
  <span>Pick Icon Picture</span>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setIconpicFile(e.target.files[0])}
  />

  {iconpicFile && (
    <img
      src={URL.createObjectURL(iconpicFile)}
      className="w-[80px] h-[40px] mt-2 rounded shadow"
      alt="Icon Preview"
    />
  )}
</label>

{/* Home Picture */}
<label className="lbl">
  <span>Pick Home Picture</span>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setHomepicFile(e.target.files[0])}
  />

  {homepicFile && (
    <img
      src={URL.createObjectURL(homepicFile)}
      className="w-[70px] h-[70px] mt-2 rounded shadow"
      alt="Home Preview"
    />
  )}
</label>

            <button type="submit" className="btn mt-10 btn-sm w-[200px]">
              Add Category
            </button>
          </form>
        </div>

        <div className="w-full p-2">
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

               <div>
  <img
    className="w-[100px] h-[40px]"
    src={`${base_url}${cat.pagecover}`}
    alt="Page Cover"
  />
</div>

<div>
  <img
    className="w-[100px] h-[40px]"
    src={`${base_url}${cat.homepic}`}
    alt="Icon"
  />
</div>

<div>
  <img
    className="w-[50px] h-[50px]"
    src={`${base_url}${cat.iconpic}`}
    alt="Home Pic"
  />
</div>
                <div>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="smbut"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="smbut"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------- EDIT MODAL ----------------- */}
      {isEditModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-[#0000001e]">
          <div className="bg-white p-5 w-[400px] rounded-md relative">
            <div className="flex justify-between items-center">
              <h2>Edit Category</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="close-btn"
              >
                <RiCloseLargeFill />
              </button>
            </div>

            <form
              onSubmit={handleEditPost}
              className="flex flex-col justify-center items-center"
            >
              <label className="flbl">
                <span>Category Name</span>
                <input
                  name="catname"
                  defaultValue={editCatData.catname}
                  type="text"
                  className="fflin"
                />
              </label>

              <label className="flbl">
                <span>Pick Cover Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  className="fflin"
                  onChange={(e) =>
                    setEditPagecoverFile(e.target.files[0])
                  }
                />
              </label>

              <label className="flbl">
                <span>Pick Icon Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  className="fflin"
                  onChange={(e) =>
                    setEditIconpicFile(e.target.files[0])
                  }
                />
              </label>

              <label className="flbl">
                <span>Pick Home Cover Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  className="fflin"
                  onChange={(e) =>
                    setEditHomepicFile(e.target.files[0])
                  }
                />
              </label>

              <button type="submit" className="btn mt-10 btn-sm w-[200px]">
                Update Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCategory;
