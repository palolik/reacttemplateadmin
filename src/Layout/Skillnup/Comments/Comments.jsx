import '../../../styles/productview.css';
import { useState } from "react";

const EComments = () => {
    const CommentData = [
        {
            cid: "213",
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            sPrice: 19.99,
            time: "12.12.2024",
            comid: "we323ewr34dswer",
            comans: "we323ewr34dswer",
        },
        {
            cid: "214",
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            sPrice: 19.99,
            time: "12.12.2024",
            comid: "we323ewr34dswer",
            comans: "we323ewr34dswer",
        },
        {
            cid: "215",
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            sPrice: 19.99,
            time: "12.12.2024",
            comid: "we323ewr34dswer",
            comans: "we323ewr34dswer",
        },
        {
            cid: "216",
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            sPrice: 19.99,
            time: "12.12.2024",
            comid: "we323ewr34dswer",
            comans: "we323ewr34dswer",
        },
        {
            cid: "217",
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            sPrice: 19.99,
            time: "12.12.2024",
            comid: "we323ewr34dswer",
            comans: "we323ewr34dswer",
        }
    ];

    const ordersPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = CommentData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(CommentData.length / ordersPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
                <div className='headr'>All Comments</div>
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
                <div>Comment ID</div>
                <div>PID</div>
                <div>Comment</div>
                <div>Comment reply</div>
                <div>Status</div>
            </div>

            <div className="flex flex-col m-2">
                {currentOrders.map((comment) => (
                    <div key={comment.cid} className="tabc">
                        <div>{comment.cid}</div>
                        <div>{comment.pID}</div>
                        <div>{comment.comid}</div>
                        <div>{comment.comans}</div>
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
    );
};

export default EComments;
