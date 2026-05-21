import { useState } from 'react';
import '../../../styles/productview.css'

const Addproducts = () => {

    const [categories, setCategories] = useState([
        { cname: 'Shirts', scname: ['T-shirts', 'Polos', 'Dress Shirts'] },
        { cname: 'Pants', scname: ['Jeans', 'Chinos', 'Shorts'] },
        { cname: 'Hats', scname: ['Caps', 'Beanies', 'Fedoras'] },
      ]);
    
      const [selectedCategory, setSelectedCategory] = useState('');
      const [selectedSubcategory, setSelectedSubcategory] = useState('');
    
 
      const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSubcategory(''); 
      };
    
      const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
      };
    
      const handleAddCategory = (categoryName, subcategoryNames) => {
        setCategories([
          ...categories,
          {
            name: categoryName,
            subcategories: subcategoryNames,
          },
        ]);
      };

    return (
        <>
        <div className='flex flex-col w-full'>
          <div className='text-[40px] bg-[#010103] text-white pl-4'>Add Products</div>
            <div className="flex flex-col gap-4 p-10 w-full ">
                <div className="flex flex-row justify-between w-full ">
                <label className="lbl">
          <div>
            <span>Category Name</span>
          </div>
          <select
            className="slt"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="lbl">
          <div>
            <span>Subcategory</span>
          </div>
          <select
            className="slt"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            disabled={!selectedCategory} 
          >
            <option value="">Select Subcategory</option>
            {selectedCategory &&
              categories
                .find((category) => category.name === selectedCategory)
                ?.subcategories.map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
          </select>
        </label>
                    <label className="lbl">
                        <div>
                            <span>Product Name</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Product supplier</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Purchase price</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Selling price</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                </div>
                <div className="flex flex-row justify-between w-full">
                    <label className="lbl">
                        <div>
                            <span>main pic</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>2nd pic</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>3rd pic</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>4th pic</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>5th pic</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>6th pic</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                </div>
              
                <div className="flex flex-col ">
                    <div id="1" className="flex flex-row justify-between bg-slate-50 pb-2">
                        <label className="lbl">
                            <div>
                                <span>Color code</span>
                            </div>
                            <input type="text" placeholder="Color Code" />
                        </label>
                        <label className="lbl ">
                            <div>
                                <span>Color Name</span>
                            </div>
                            <input type="text" placeholder="Color Name" />
                        </label>
                        <label className="lbl ">
                            <div>
                                <span>Size</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                        <label className="lbl ">
                            <div>
                                <span>Quantity</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                    </div>
                    <div id="2" className="flex flex-row justify-between bg-slate-100 pb-2">
                        <label className="lbl">
                            <div>
                                <span>Color code</span>
                            </div>
                            <input type="text" placeholder="Color Code" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Color Name</span>
                            </div>
                            <input type="text" placeholder="Color Name" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Size</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Quantity</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                    </div>
                    <div id="3" className="flex flex-row justify-between bg-slate-50 pb-2">
                        <label className="lbl">
                            <div>
                                <span>Color code</span>
                            </div>
                            <input type="text" placeholder="Color Code" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Color Name</span>
                            </div>
                            <input type="text" placeholder="Color Name" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Size</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Quantity</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                    </div>
                    <div id="4" className="flex flex-row justify-between bg-slate-100 pb-2">
                        <label className="lbl">
                            <div>
                                <span>Color code</span>
                            </div>
                            <input type="text" placeholder="Color Code" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Color Name</span>
                            </div>
                            <input type="text" placeholder="Color Name" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Size</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                        <label className="lbl">
                            <div>
                                <span>Quantity</span>
                            </div>
                            <input type="text" placeholder="Type here" />
                        </label>
                    </div>
                </div>
                <div className='flex flex-row'>
                <label className="lbl mr-10">
                        <div>
                            <span>PID</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl mr-10">
                        <div>
                            <span>location</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl mr-10">
                        <div>
                            <span>tags</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="form-control  max-w-xs ">
                        <div>
                            <span>Description</span>
                        </div>
                        <textarea placeholder="Product Description"   className="textarea textarea-bordered textarea-sm w-auto max-w-xs  resize"></textarea>
                     </label>
                    </div>
            </div>
            <div className='flex flex-col justify-center items-center'><button className='btn btn-sm  w-[400px]'>Add Product</button></div>
        </div>
        </>
    );
};

export default Addproducts;