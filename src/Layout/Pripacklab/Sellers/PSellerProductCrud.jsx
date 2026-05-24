import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { base_url } from "../../config/config";

const PRESET_CRITERIA = ["Size", "Cut", "Color", "Material", "Quantity", "Weight"];

const emptyForm = {
  category: "",
  subCategory: "",
  productName: "",
  productDescription: "",
  deliveryTime: "",
};

const SellerProductCrud = ({ seller }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productData, setProductData] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [criteria, setCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("");
  const [customCriteriaName, setCustomCriteriaName] = useState("");
  const [valueInputs, setValueInputs] = useState({});

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [existingPics, setExistingPics] = useState([]);

  const sellerId = seller?.userId || seller?._id;

  const filteredSubcategories = useMemo(() => {
    if (!productData.category) return [];
    return subcategories.filter(
      (sub) => sub.catname?.toLowerCase() === productData.category.toLowerCase()
    );
  }, [productData.category, subcategories]);

  const fetchProducts = async () => {
    if (!sellerId) return;

    try {
      const res = await fetch(`${base_url}/sellerproducts/${sellerId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${base_url}/getcatnsub`);
      const data = await res.json();

      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setSubcategories(Array.isArray(data.subcategories) ? data.subcategories : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [sellerId]);

  const resetForm = () => {
    setProductData(emptyForm);
    setTags([]);
    setTagInput("");
    setCriteria([]);
    setSelectedCriteria("");
    setCustomCriteriaName("");
    setValueInputs({});
    setVariants([]);
    setImages([]);
    setExistingPics([]);
    setEditingProduct(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setProductData({
      category: product.category || "",
      subCategory: product.subCategory || "",
      productName: product.productName || "",
      productDescription: product.productDescription || "",
      deliveryTime: product.deliveryTime || "",
    });

    setTags(Array.isArray(product.tags) ? product.tags : []);
    setCriteria(Array.isArray(product.criteria) ? product.criteria : []);
    setVariants(Array.isArray(product.variants) ? product.variants : []);
    setExistingPics(Array.isArray(product.mainPics) ? product.mainPics : []);
    setImages([]);
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const addTag = () => {
    const cleanTag = tagInput.trim();
    if (!cleanTag || tags.includes(cleanTag)) return;

    setTags((prev) => [...prev, cleanTag]);
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const addCriteria = () => {
    const name =
      selectedCriteria === "Custom"
        ? customCriteriaName.trim()
        : selectedCriteria.trim();

    if (!name) return;

    const exists = criteria.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) return;

    setCriteria((prev) => [...prev, { name, values: [] }]);
    setSelectedCriteria("");
    setCustomCriteriaName("");
    setVariants([]);
  };

  const removeCriteria = (name) => {
    setCriteria((prev) => prev.filter((item) => item.name !== name));
    setVariants([]);
  };

  const addCriteriaValue = (criteriaName) => {
    const value = valueInputs[criteriaName]?.trim();
    if (!value) return;

    setCriteria((prev) =>
      prev.map((item) =>
        item.name === criteriaName && !item.values.includes(value)
          ? { ...item, values: [...item.values, value] }
          : item
      )
    );

    setValueInputs((prev) => ({ ...prev, [criteriaName]: "" }));
    setVariants([]);
  };

  const removeCriteriaValue = (criteriaName, value) => {
    setCriteria((prev) =>
      prev.map((item) =>
        item.name === criteriaName
          ? { ...item, values: item.values.filter((v) => v !== value) }
          : item
      )
    );

    setVariants([]);
  };

  const generateVariants = () => {
    const activeCriteria = criteria.filter((item) => item.values.length > 0);

    if (activeCriteria.length === 0) {
      Swal.fire("Add values first", "Please add criteria values.", "info");
      return;
    }

    let combinations = [{}];

    activeCriteria.forEach(({ name, values }) => {
      combinations = combinations.flatMap((combo) =>
        values.map((value) => ({ ...combo, [name]: value }))
      );
    });

    const generatedVariants = combinations.map((combo, index) => ({
      id: `var_${Date.now()}_${index}`,
      combination: combo,
      label: Object.values(combo).join(" / "),
      price: "",
      profit: "",
      discount: "",
      is_active: true,
    }));

    setVariants(generatedVariants);
  };

  const addManualVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `var_${Date.now()}`,
        combination: {},
        label: "Default",
        price: "",
        profit: "",
        discount: "",
        is_active: true,
      },
    ]);
  };

  const updateVariant = (id, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const removeVariant = (id) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== id));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingPics((prev) => prev.filter((_, i) => i !== index));
  };

  const getImageUrl = (pic) => {
    if (!pic) return "";
    if (pic.startsWith("http")) return pic;
    if (pic.startsWith("/uploads")) return `${base_url}${pic}`;
    const uploadsIndex = pic.indexOf("/uploads");
    if (uploadsIndex !== -1) return `${base_url}${pic.substring(uploadsIndex)}`;
    return pic;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sellerId) {
      Swal.fire("Error", "Seller data not found. Please login again.", "error");
      return;
    }

    const formData = new FormData();

    formData.append("category", productData.category);
    formData.append("subCategory", productData.subCategory);
    formData.append("productName", productData.productName);
    formData.append("productDescription", productData.productDescription);
    formData.append("productSupplier", seller.name || "");
    formData.append("deliveryTime", productData.deliveryTime);

    formData.append("sellerId", sellerId);
    formData.append("sellerName", seller.name || "");
    formData.append("sellerPhone", seller.phone || "");

    formData.append("tags", JSON.stringify(tags));
    formData.append("criteria", JSON.stringify(criteria));
    formData.append("variants", JSON.stringify(variants));

    if (editingProduct) {
      formData.append("existingPics", JSON.stringify(existingPics));
    }

    images.forEach((file) => formData.append("mainPics", file));

    const url = editingProduct
      ? `${base_url}/editproduct/${editingProduct._id}`
      : `${base_url}/addproduct`;

    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        Swal.fire("Error", "Product was not saved.", "error");
        return;
      }

      Swal.fire(
        editingProduct ? "Updated!" : "Added!",
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully.",
        "success"
      );

      closeForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire("Error", "Unexpected error occurred.", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await fetch(`${base_url}/delproduct/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.deletedCount > 0) {
          Swal.fire("Deleted!", "Product deleted successfully.", "success");
          fetchProducts();
        } else {
          Swal.fire("Error", "Product was not deleted.", "error");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Error", "Unexpected error occurred.", "error");
      }
    });
  };

  const availableCriteria = PRESET_CRITERIA.filter(
    (item) => !criteria.some((c) => c.name === item)
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-slate-800">My Products</h2>

        <button onClick={openAddForm} className="smbut">
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
        <table className="table-auto w-full">
          <thead className="bg-gray-100">
            <tr className="text-center font-semibold">
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Variants</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center border-b">
                <td className="py-2">
                  {product.mainPics?.[0] ? (
                    <img
                      src={getImageUrl(product.mainPics[0])}
                      alt={product.productName}
                      className="w-14 h-14 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </td>

                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.subCategory}</td>
                <td>{product.variants?.length || 0}</td>
                <td>{product.deliveryTime || "N/A"}</td>

                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEditForm(product)}
                      className="btn btn-xs btn-warning"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <select
                  className="flinselect"
                  value={productData.category}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      category: e.target.value,
                      subCategory: "",
                    })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.catname}>
                      {category.catname}
                    </option>
                  ))}
                </select>

                <select
                  className="flinselect"
                  value={productData.subCategory}
                  onChange={(e) =>
                    setProductData({ ...productData, subCategory: e.target.value })
                  }
                  disabled={!productData.category}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub._id} value={sub.subcat}>
                      {sub.subcat}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="flin"
                  placeholder="Product Name"
                  value={productData.productName}
                  onChange={(e) =>
                    setProductData({ ...productData, productName: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  className="flin"
                  placeholder="Delivery Time, e.g. 3-5 Days"
                  value={productData.deliveryTime}
                  onChange={(e) =>
                    setProductData({ ...productData, deliveryTime: e.target.value })
                  }
                />

                <textarea
                  className="textarea textarea-bordered w-full min-h-[150px]"
                  placeholder="Product Description"
                  value={productData.productDescription}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productDescription: e.target.value,
                    })
                  }
                />

                <div className="border rounded-xl p-4">
                  <p className="font-semibold mb-2">Tags</p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flin flex-1"
                      placeholder="Add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />

                    <button type="button" onClick={addTag} className="btn btn-sm">
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border rounded-xl p-4">
                  <p className="font-semibold mb-2">Images</p>

                  <input
                    type="file"
                    multiple
                    name="mainPics"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full"
                  />

                  <div className="flex flex-wrap gap-3 mt-3">
                    {existingPics.map((pic, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={getImageUrl(pic)}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />

                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={URL.createObjectURL(img)}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />

                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border rounded-xl p-4">
                  <p className="font-semibold mb-3">Criteria</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select
                      className="flinselect"
                      value={selectedCriteria}
                      onChange={(e) => setSelectedCriteria(e.target.value)}
                    >
                      <option value="">Select Criteria</option>
                      {availableCriteria.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value="Custom">Custom</option>
                    </select>

                    {selectedCriteria === "Custom" && (
                      <input
                        type="text"
                        className="flin"
                        placeholder="Custom name"
                        value={customCriteriaName}
                        onChange={(e) => setCustomCriteriaName(e.target.value)}
                      />
                    )}

                    <button type="button" onClick={addCriteria} className="btn btn-sm">
                      Add Criteria
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {criteria.map((item) => (
                      <div key={item.name} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{item.name}</p>

                          <button
                            type="button"
                            onClick={() => removeCriteria(item.name)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            className="flin flex-1"
                            placeholder={`Add ${item.name} value`}
                            value={valueInputs[item.name] || ""}
                            onChange={(e) =>
                              setValueInputs((prev) => ({
                                ...prev,
                                [item.name]: e.target.value,
                              }))
                            }
                          />

                          <button
                            type="button"
                            onClick={() => addCriteriaValue(item.name)}
                            className="btn btn-sm"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.values.map((value) => (
                            <span
                              key={value}
                              className="px-3 py-1 rounded-full bg-gray-100 text-xs"
                            >
                              {value}
                              <button
                                type="button"
                                onClick={() => removeCriteriaValue(item.name, value)}
                                className="ml-2 text-red-500"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={generateVariants}
                    className="btn btn-sm mt-4 w-full"
                  >
                    Generate Variants
                  </button>
                </div>

                <div className="border rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold">Variants</p>

                    <button
                      type="button"
                      onClick={addManualVariant}
                      className="btn btn-xs"
                    >
                      + Manual Variant
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="grid grid-cols-1 md:grid-cols-5 gap-2 border rounded-lg p-2"
                      >
                        <input
                          type="text"
                          className="flin"
                          placeholder="Label"
                          value={variant.label}
                          onChange={(e) =>
                            updateVariant(variant.id, "label", e.target.value)
                          }
                        />

                        <input
                          type="number"
                          className="flin"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(variant.id, "price", e.target.value)
                          }
                        />

                        <input
                          type="number"
                          className="flin"
                          placeholder="Profit"
                          value={variant.profit}
                          onChange={(e) =>
                            updateVariant(variant.id, "profit", e.target.value)
                          }
                        />

                        <input
                          type="number"
                          className="flin"
                          placeholder="Discount"
                          value={variant.discount}
                          onChange={(e) =>
                            updateVariant(variant.id, "discount", e.target.value)
                          }
                        />

                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="btn btn-sm btn-error"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {variants.length === 0 && (
                      <p className="text-center text-sm text-gray-400 py-4">
                        No variants added.
                      </p>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductCrud;