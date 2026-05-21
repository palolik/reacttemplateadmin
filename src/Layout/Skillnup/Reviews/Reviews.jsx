import '../../../styles/productview.css';
import { useState } from "react";

const EReviews = () => {
    const orderData = [
        {
            slNo: 5,
            cid: "C12349",
            cname: "Machine Learning",
            subcatname: "AI & ML",
            crsname: "Introduction to Machine Learning",
            rating: "4",
            review: "dasdas asd asd asd ",
            status: "Active",
            dateAdded: "2025-02-10",
        },
        
        {
            slNo: 5,
            cid: "C12349",
            cname: "Machine Learning",
            subcatname: "AI & ML",
            crsname: "Introduction to Machine Learning",
            rating: "4",
            review: "dasdas asd asd asd ",
            status: "Active",
            dateAdded: "2025-02-10",
        },  
        {
            slNo: 5,
            cid: "C12349",
            cname: "Machine Learning",
            subcatname: "AI & ML",
            crsname: "Introduction to Machine Learning",
            rating: "4",
            review: "dasdas asd asd asd ",
            status: "Active",
            dateAdded: "2025-02-10",
        },  
        {
            slNo: 5,
            cid: "C12349",
            cname: "Machine Learning",
            subcatname: "AI & ML",
            crsname: "Introduction to Machine Learning",
            rating: "4",
            review: "dasdas asd asd asd ",
            status: "Active",
            dateAdded: "2025-02-10",
        },
        {
            slNo: 5,
            cid: "C12349",
            cname: "Machine Learning",
            subcatname: "AI & ML",
            crsname: "Introduction to Machine Learning",
            rating: "4",
            review: "dasdas asd asd asd ",
            status: "Active",
            dateAdded: "2025-02-10",
        },
    ];

    const ordersPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = orderData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(orderData.length / ordersPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
        <div className='headr'>All Reviews</div>
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
            <div>s no.</div>
                <div>date added</div>
                <div>C ID</div>
                <div>Category</div>
                <div>Sub Category</div>
                <div>Course Name</div>
                <div>Rating</div>
                <div>Review</div>
                <div>Status</div>
                <div>Action</div>
            </div>
            <div className="flex flex-col m-2">
                {currentOrders.map((order) => (
                    <div key={order.slNo} className="tabc">
                        <div>{order.slNo}</div>
                        <div>{order.dateAdded}</div>
                        <div>{order.cid}</div>
                        <div>{order.cname}</div>
                        <div>{order.subcatname}</div>
                        <div>{order.crsname}</div>
                        <div>{order.rating}</div>
                        <div>{order.review}</div>
                        <div><button className="smbut ">{order.status}</button></div>
                        <div><button className="smbut ">Delete</button> </div>
                    </div>
                ))}
            </div>

        
            <div className="pag">
                <div>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>{currentPage}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default EReviews;
