import { useState } from 'react';
import '../../../styles/productview.css';

const Advertisement = () => {

    const [companyData, setCompanyData] = useState([
        { 
            id: 1, 
            cname: "Shirts", 
            clicks: "20", 
            link: "https://www.shirts.com", 
            duration: "3 months", 
            area: "Worldwide", 
            wideAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg", 
            leftAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg", 
            rightAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
        },
        { 
            id: 2, 
            cname: "Pants", 
            clicks: "20", 
            link: "https://www.pants.com", 
            duration: "2 months", 
            area: "USA", 
            wideAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg", 
            leftAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg", 
            rightAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
        },
        { 
            id: 3, 
            cname: "Watches", 
            clicks: "20", 
            link: "https://www.watches.com", 
            duration: "1 month", 
            area: "Europe", 
            wideAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg", 
            leftAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg", 
            rightAdv: "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
        }
    ]);

    const [editCompany, setEditCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (company) => {
        setEditCompany({ ...company });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditCompany((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedCompanies = companyData.map((company) =>
            company.id === editCompany.id ? editCompany : company
        );
        setCompanyData(updatedCompanies);
        setIsModalOpen(false); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); 
    };

    return (
        <div className='w-full'>   
            <div className='hdr'>Advertisement</div>
            <div className="flex flex-row p-2 w-full">
                <div className="flex flex-col gap-4 p-2">
                    <label className="lbl">
                        <div>
                            <span>Company Name</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Link</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Duration</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Target Area</span>
                        </div>
                        <input type="text" placeholder="Type here" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Wide Ad</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Left Side Ad</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Right Side Ad</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>

                    <button className='btn mt-10 btn-sm w-[200px]'>Add Category</button>
                </div>

                <div className="flex flex-col">
                    <div className='headrr'>
                        <div>
                            <button className="mr-2">Import</button>
                            <button >Export</button>
                        </div>
                        <div className='srch'>
                            <input type="text" placeholder="Search" />
                            <button>Search</button> 
                        </div>
                    </div>

                    <div className="tabst">
                        <div>S No.</div>
                        <div>Company</div>
                        <div>Clicks</div>
                        <div>Link</div>
                        <div>Duration</div>
                        <div>Area</div>
                        <div>Add Wide</div>
                        <div>Add Left</div>
                        <div>Add Right</div>
                        <div>Sides</div>
                    </div>

                    <div className="flex flex-col m-2">
                        {companyData.map((company) => (
                            <div key={company.id} className="tabc">
                                <div><p>{company.id}</p></div>
                                <div><p>{company.cname}</p></div>
                                <div><p>{company.clicks}</p></div>
                                <div><p>{company.link}</p></div>
                                <div><p>{company.duration}</p></div>
                                <div><p>{company.area}</p></div>
                                <div><img className="w-[40px] h-[10px]" src={company.wideAdv} alt="Wide Ad" /></div>
                                <div><img className="w-[20px] h-[20px]" src={company.leftAdv} alt="Left Ad" /></div>
                                <div><img className="w-[20px] h-[20px]" src={company.rightAdv} alt="Right Ad" /></div>
                                <div>
                                    <button className="smbut" onClick={() => handleEdit(company)}>Edit</button>
                                    <button className="smbut">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isModalOpen && (    
            <div className="mlay">
            <div className="mtent">
                    <div className="mohedr">
                        <h3 className="mter">Edit Company</h3>
                        <button onClick={handleCloseModal} className="cbtn">
                        X
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label className="block mt-4">
                        <div>Company Name</div>
                        <input
                            type="text"
                            name="cname"
                            value={editCompany.cname}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        </label>
                        <label className="block mt-4">
                        <div>Link</div>
                        <input
                            type="text"
                            name="link"
                            value={editCompany.link}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        </label>
                        <label className="block mt-4">
                        <div>Duration</div>
                        <input
                            type="text"
                            name="duration"
                            value={editCompany.duration}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        </label>
                        <label className="block mt-4">
                        <div>Target Area</div>
                        <input
                            type="text"
                            name="area"
                            value={editCompany.area}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        </label>
                        <div className="flex justify-between mt-6">
                            <button type="submit" className="ccbtn">Save Changes</button>
                            <button  type="button" onClick={handleCloseModal} className="obtn"> Cancel </button>
                        </div>
                    </form>
                </div>
            </div>
            )}
        </div>
    );
};

export default Advertisement;
