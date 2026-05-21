import { useState } from 'react';
import '../../../styles/productview.css';

const SAddmodules = () => {


  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructorId, setCourseInstructorId] = useState('');

  const ModuleData = [
    {
      cid:"asd",
      modname:"asd",
      vidtitle:"asd",
      desc:"asd",
      video:"asd",
      status:"asd",
    },
    {
      cid:"asd",
      modname:"asd",
      vidtitle:"asd",
      desc:"asd",
      video:"asd",
      status:"asd",
    },
    {
      cid:"asd",
      modname:"asd",
      vidtitle:"asd",
      desc:"asd",
      video:"asd",
      status:"asd",
    },
    {
      cid:"asd",
      modname:"asd",
      vidtitle:"asd",
      desc:"asd",
      video:"asd",
      status:"asd",
    },
    {
      cid:"asd",
      modname:"asd",
      vidtitle:"asd",
      desc:"asd",
      video:"asd",
      status:"asd",
    }
];

const ordersPerPage = 7;
const [currentPage, setCurrentPage] = useState(1);

const startIndex = (currentPage - 1) * ordersPerPage;
const endIndex = startIndex + ordersPerPage;
const currentOrders = ModuleData.slice(startIndex, endIndex);

const totalPages = Math.ceil(ModuleData.length / ordersPerPage);

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
};

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='text-[40px] bg-[#010103] text-white pl-4'>Add Module Details</div>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row flex-wrap gap-5'>
            <label className='lbl'>
              <div>
                <span>Course ID:</span>
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
                <span>Module Name:</span>
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
                <span>title:</span>
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
                <span>Description:</span>
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
                <span>Video:</span>
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
                <span>Resourse file:</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                value={courseInstructorId}
                onChange={(e) => setCourseInstructorId(e.target.value)}
              />
            </label>
          
           
          </div>
          <div className='flex flex-col justify-center items-center'>
            <button className='btn btn-sm w-[400px]'>Add Module</button>
          </div>
          </div>
        <div className="w-full">
                <div className='headrr'>
                    <div>
                        <button className="mr-2">Import</button>
                        <button >Export</button>
                    </div>
                    <div className='srch'>
                        <input type="text"  placeholder="Search" />
                        <button>Search</button> 
                    </div>
                </div>
            <div className="tabst">
                <div>Course id</div>
                <div>Module name:</div>
                <div>Video title:</div>
                <div>Description:</div>
                <div>Video:</div>
                <div>Status:</div>
                <div>Action</div>
            </div>
            <div className="flex flex-col m-2">
                {currentOrders.map((modules) => (
                    <div key={modules.cid} className="tabc">
                        <div>{modules.cid}</div>
                        <div>{modules.modname}</div>
                        <div>{modules.vidtitle}</div>
                        <div>{modules.desc}</div>
                        <div>{modules.video}</div>
                        <div>{modules.status}</div>
                        <div>
              
                        <div className="pag">
                <div>
                    <button>hide</button>
                    <button>delete</button>
                </div>
            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pag">
                <div>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>{currentPage}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>

         
       
      </div>
    </>
  );
};
export default SAddmodules;
