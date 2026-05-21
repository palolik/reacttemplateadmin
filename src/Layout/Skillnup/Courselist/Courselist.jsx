import '../../../styles/productview.css'


import { useState } from "react";
const Courselist = () => {
    const courseData = [
        {
            slNo: 1,
            cid: "C12345",
            iid: "I001",
            cname: "Web Development",
            subcatname: "Front End",
            crsname: "React",
            desc: "Learn the fundamentals of web development using React. From setting up your environment to building dynamic web applications.",
            sold: "Fashion Inc.",
            impressions: 150,
            price: 199.99,
            status: "Active",
            duration: "30 hours",
            dateAdded: "2025-02-01",
        },
        {
            slNo: 2,
            cid: "C12346",
            iid: "I002",
            cname: "Graphic Design",
            subcatname: "Design",
            crsname: "Adobe Photoshop",
            desc: "Master Adobe Photoshop for graphic design. Learn tools, tips, and techniques for creating stunning designs.",
            sold: "20",
            impressions: 220,
            price: 299.99,
            status: "Active",
            duration: "40 hours",
            dateAdded: "2025-01-15",
        },
        {
            slNo: 3,
            cid: "C12347",
            iid: "I003",
            cname: "Digital Marketing",
            subcatname: "Marketing",
            crsname: "SEO Mastery",
            desc: "Become an SEO expert. Learn the most effective techniques to improve your website ranking on search engines.",
            sold: "41",
            impressions: 320,
            price: 249.99,
            status: "Active",
            duration: "20 hours",
            dateAdded: "2025-02-05",
        },
        {
            slNo: 4,
            cid: "C12348",
            iid: "I004",
            cname: "Data Science",
            subcatname: "Data Analysis",
            crsname: "Python for Data Science",
            desc: "Learn Python for Data Science. Analyze datasets, perform data cleaning, and create visualizations using Python.",
            sold: "84",
            impressions: 180,
            price: 149.99,
            status: "Inactive",
            duration: "35 hours",
            dateAdded: "2025-01-20",
        },
        {
            slNo: 5,
            cid: "C12349",
            iid: "I005",
            cname: "Machine Learning",
            subcatname: "AI & ML",
            crsname: "Introduction to Machine Learning",
            desc: "Get started with machine learning. Learn the basics of ML algorithms, data preprocessing, and model evaluation.",
            sold: "52",
            impressions: 100,
            price: 349.99,
            status: "Active",
            duration: "50 hours",
            dateAdded: "2025-02-10",
        },
        {
            slNo: 6,
            cid: "C12350",
            iid: "I006",
            cname: "Mobile App Development",
            subcatname: "Mobile Development",
            crsname: "React Native",
            desc: "Learn how to build mobile applications with React Native. Create real-world applications and deploy them to both Android and iOS.",
            sold: "11",
            impressions: 410,
            price: 299.99,
            status: "Active",
            duration: "45 hours",
            dateAdded: "2025-02-11",
        },
        {
            slNo: 7,
            cid: "C12351",
            iid: "I007",
            cname: "Cybersecurity",
            subcatname: "Network Security",
            crsname: "Ethical Hacking",
            desc: "Learn ethical hacking techniques. Understand the methods used by hackers and learn how to protect networks from threats.",
            sold: "13",
            impressions: 180,
            price: 399.99,
            status: "Active",
            duration: "60 hours",
            dateAdded: "2025-02-08",
        },
        {
            slNo: 8,
            cid: "C12352",
            iid: "I008",
            cname: "Cloud Computing",
            subcatname: "Cloud Services",
            crsname: "AWS Certified Solutions Architect",
            desc: "Prepare for the AWS Solutions Architect exam. Learn how to design and deploy scalable, highly available systems on AWS.",
            sold: "85",
            impressions: 250,
            price: 499.99,
            status: "Active",
            duration: "80 hours",
            dateAdded: "2025-01-25",
        },
        {
            slNo: 9,
            cid: "C12353",
            iid: "I009",
            cname: "UI/UX Design",
            subcatname: "Design",
            crsname: "User Experience Design",
            desc: "Learn UX design fundamentals. Master the design process, user research, wireframing, prototyping, and usability testing.",
            sold: "95",
            impressions: 300,
            price: 179.99,
            status: "Active",
            duration: "25 hours",
            dateAdded: "2025-02-03",
        },
        {
            slNo: 10,
            cid: "C12354",
            iid: "I010",
            cname: "Software Development",
            subcatname: "Programming",
            crsname: "Java for Beginners",
            desc: "Learn Java from scratch. Understand object-oriented programming and build Java applications.",
            sold: "32",
            impressions: 210,
            price: 159.99,
            status: "Inactive",
            duration: "40 hours",
            dateAdded: "2025-01-18",
        },
    ];
    
  
    const productsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = courseData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(courseData.length / productsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
          <div className="w-full">
                <div className='headr'>Course List</div>
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
          <div>cid</div>  
          <div>iid</div>  
           <div>cname</div> 
           <div>subcatname</div> 
           <div>crsname</div> 
           <div>desc</div> 
           <div>sold</div> 
           <div>impressions</div> 
           <div>price</div>      
    <div>status</div>     
    <div>duration</div>   
    <div>dateAdded</div>  
                <div>Action Buttons</div>
            </div>
            <div className="flex flex-col m-2">
                {currentProducts.map((product) => (
                    <div key={product.slNo} className="tabc">
                        <div><p>{product.cid}</p></div>
                        <div><p>{product.iid}</p></div>
                        <div><p>{product.cname}</p></div>
                        <div><p>{product.subcatname}</p></div>
                        <div><p>{product.crsname}</p></div>
                        <div><p className=' text-[10px]'>{product.desc}</p></div>
                        <div><p>{product.impressions}</p></div>
                        <div><p>{product.sold}</p></div> 
                        <div><p>{product.price}</p></div>        
                        <div><p>{product.status}</p></div>       
                        <div><p>{product.duration}</p></div>     
                        <div><p>{product.dateAdded}</p></div>                        
                        <div className='flex flex-col'>
                            <button className="smbut ">Edit</button>
                            <button className="smbut ">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className='pag'>
                    <div >
                        <button  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        <span className="">{currentPage}</span>
                        <button  onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Courselist;
