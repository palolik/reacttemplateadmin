/* eslint-disable no-unused-vars */
import '../../../styles/productview.css';
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { base_url } from '../../../config/config';
const PSubcategory = () => {
    const [categories, setCategories] = useState([]); 
    const [subcategories, setSubcategories] = useState([]);  
    const [selectedCategory, setSelectedCategory] = useState('');  

    useEffect(() => {
        fetch(`${base_url}/getcatnsub`)
            .then(res => res.json())
            .then(data => {
                setCategories(data.categories);  
                setSubcategories(data.subcategories);  
            })
            .catch(error => console.error('Error fetching categories and subcategories:', error));
    }, []);

    const handleAddPost = async (event) => {
        event.preventDefault();
        const form = event.target;
        const getTrimmedValue = (name) => {
            const value = form[name]?.value;
            return value ? value.trim() : '';
        };

        const subcat = getTrimmedValue('subcat');
        
        if (!selectedCategory) {
            Swal.fire({
                title: "Error!",
                text: "Please select a category.",
                icon: "error",
            });
            return;
        }

        const postData = {
            catname: selectedCategory,
            subcat,
        };

        try {
            const response = await fetch(`${base_url}/addsub`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            const data = await response.json();
            if (data.insertedId) {
                Swal.fire({
                    title: "New Subcategory Added!",
                    text: "You have successfully added a new subcategory.",
                    icon: "success",
                });
                form.reset();
                setSubcategories(prevSubcats => [...prevSubcats, postData]); 
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "There was an issue adding the subcategory.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred.",
                icon: "error",
            });
        }
    };

    const handleDeleteSubcategory = async (id) => {
    if (!id) return;

    const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This subcategory will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
        const res = await fetch(`${base_url}/deletesub/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (data.deletedCount > 0) {
            Swal.fire("Deleted!", "Subcategory removed.", "success");

            // Update UI
            setSubcategories((prev) =>
                prev.filter((item) => item._id !== id)
            );
        }
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        Swal.fire("Error", "Failed to delete subcategory", "error");
    }
};

    const groupedSubcategories = subcategories.reduce((acc, subcat) => {
        if (!acc[subcat.catname]) {
            acc[subcat.catname] = [];
        }
        acc[subcat.catname].push(subcat.subcat);
        return acc;
    }, {});
    return (
        <div className='w-full flex flex-col'>
            <div className='hdr'>Sub Category</div>
            <div className="flex flex-row w-full p-2">
                <div className="flex flex-col gap-4 p-2 w-[350px]">
                    <form onSubmit={handleAddPost}>
                        <label className="lbl">
                            <div>
                                <span>Category Name</span>
                            </div>
                            <select 
                                className="flinselect" 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Select a Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.catname}>
                                        {cat.catname}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="lbl">
                            <div>
                                <span>Sub Category Name</span>
                            </div>
                            <input name="subcat" type="text" className="flin" required />
                        </label>

                        <button type="submit" className='btn mt-10 btn-sm w-[200px]'>Add Subcategory</button>
                    </form>
                </div>

                <div className="w-full">
                    <div className="tabst">
                        <div>Category Name</div>
                        <div>Sub Category Name</div>
                    </div>
                    <div className="flex flex-col m-2">
                   {Object.entries(groupedSubcategories).map(([catName, subcatArray], index) => (
    <div key={index} className="tabc">
        <div>{catName}</div>
        <div>
            <ol>
                {subcatArray.map((subcat, subIndex) => {
                    const subcatObj = subcategories.find(
                        (s) => s.catname === catName && s.subcat === subcat
                    );

                    return (
                        <li key={subIndex} className="flex items-center gap-4">
                            <span>{subcat}</span>

                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                onClick={() =>
                                    handleDeleteSubcategory(subcatObj?._id)
                                }
                            >
                                Delete
                            </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    </div>
))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PSubcategory;
