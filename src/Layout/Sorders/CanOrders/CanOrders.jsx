import '../../../styles/productview.css'

import { useState } from "react";
const SCanOrders = () => {
    const orderData = [
        {
            orderID: "ORD001",
            orderDate: "2025-01-29",
            customerID: "CUST123",
            customerName: "topu",
            customerEmail: "topu@gmail.com",
            customerPhone: "0168256947",
            courseid: "0168256947",
            totalAmount: 59.97,
            district: "mirpur",
            payMethod: "Credit Card",
            status: "Pending",
          
        },
        {
            orderID: "ORD001",
            orderDate: "2025-01-29",
            customerID: "CUST123",
            customerName: "hridoy",
            customerEmail: "hridoy@gmail.com",
            customerPhone: "01618702323",
            courseid: "0168256947",
            totalAmount: 59.97,
            district: "dhaka",
            payMethod: "Credit Card",
            status: "Pending",
           
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
        <>
           <div className="w-full">
                <div className='headr'>Cancelled Orders</div>
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
                    <div>Order ID</div>
                    <div>Order Date</div>
                    <div>Customer Details</div>
                    <div>Course Details</div>
                    <div>Price</div>
                    <div>Payment Method</div>
                    <div>Status</div>
                    <div>Action Buttons</div>
                </div>
                <div className="flex flex-col m-2">
                    {currentOrders.map((order,) => (
                        <div key={order.orderID} className="tabc">

                            <div>
                                <p>{order.orderID}</p>
                            </div>
                            <div>
                                <p>{order.orderDate}</p>
                            </div>
                            <div>
                                <p><strong>{order.customerName}</strong></p>
                                <p><strong>{order.customerEmail}</strong></p>
                                <p>{order.customerPhone}</p>
                                <p>{order.district}</p>
                                <p>{order.shipAdd}</p>
                            </div>
                            <div>
                                <p>${order.courseid}</p>
                            </div>
                            <div>
                                <p>${order.totalAmount}</p>
                            </div>
                            <div>
                                <p>{order.payMethod}</p>
                            </div>
                           
                            <div>
                                <p>{order.status}</p>
                            </div>
                            <div>
                                <button className="smbut">Edit</button>
                                <button className="smbut">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='pag'>
                    <div>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        <span>{currentPage}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SCanOrders;
