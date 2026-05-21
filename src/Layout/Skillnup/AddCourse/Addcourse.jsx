import { useState } from 'react';
import '../../../styles/productview.css';

const SAddcourse = () => {
  const [categories, setCategories] = useState([
    { cname: 'Shirts', scname: ['T-shirts', 'Polos', 'Dress Shirts'] },
    { cname: 'Pants', scname: ['Jeans', 'Chinos', 'Shorts'] },
    { cname: 'Hats', scname: ['Caps', 'Beanies', 'Fedoras'] },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructorId, setCourseInstructorId] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [moduleNames, setModuleNames] = useState([]);
  const [moduleInput, setModuleInput] = useState('');

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleAddModule = () => {
    if (moduleInput.trim()) {
      setModuleNames([...moduleNames, moduleInput]);
      setModuleInput('');
    }
  };

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='text-[40px] bg-[#010103] text-white pl-4'>Add Course</div>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row flex-wrap gap-5'>
            <label className='lbl'>
              <div>
                <span>Category Name</span>
              </div>
              <select
                className='slt'
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value=''>Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.cname}>
                    {category.cname}
                  </option>
                ))}
              </select>
            </label>
            <label className='lbl'>
              <div>
                <span>Subcategory</span>
              </div>
              <select
                className='slt'
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                disabled={!selectedCategory}
              >
                <option value=''>Select Subcategory</option>
                {selectedCategory &&
                  categories
                    .find((category) => category.cname === selectedCategory)
                    ?.scname.map((sub, index) => (
                      <option key={index} value={sub}>
                        {sub}
                      </option>
                    ))}
              </select>
            </label>
            <label className='lbl'>
              <div>
                <span>Course Name</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </label>
            <label className='lbl'>
              <div>
                <span>Course Short Description</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
              />
            </label>
            <label className='lbl'>
              <div>
                <span>Course Instructor ID</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={courseInstructorId}
                onChange={(e) => setCourseInstructorId(e.target.value)}
              />
            </label>
            <label className='lbl'>
              <div>
                <span>Course Cover Pic:</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={courseInstructorId}
                onChange={(e) => setCourseInstructorId(e.target.value)}
              />
            </label>
            <label className='lbl'>
              <div>
                <span>Course Intro Video Link:</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={courseInstructorId}
                onChange={(e) => setCourseInstructorId(e.target.value)}
              />
            </label>
            <label className='lbl'>
              <div>
                <span>Selling Price</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
              />
            </label>
            <label >
              <div className='flex flex-col items-start justify-start'>
              <div>
                <span>Module Names:</span>
              </div>
           
              <div className='flex flex-row justify-start'>
              <input
                type='text'
                placeholder='Type module name'
                value={moduleInput}
                onChange={(e) => setModuleInput(e.target.value)}
              />
              <button type='button' className='btn btn-sm ' onClick={handleAddModule}>Add Module</button>
              </div>
              <div className='border-gray-200 border-[1px] w-full'>
              <ol>
                {moduleNames.map((module, index) => (
                  <li key={index}>{index}.{module}</li>
                ))}
              </ol>
              </div>
            </div>
            </label>
          </div>

          <div className='flex flex-col justify-center items-center'>
            <button className='btn btn-sm w-[400px]'>Add Course</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SAddcourse;
