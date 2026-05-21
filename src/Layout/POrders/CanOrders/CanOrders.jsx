import '../../../styles/productview.css'

import { useState } from "react";
const PCanOrders = () => {
    const orderData = [
        {
            orderID: "ORD001",
            orderDate: "2025-01-29",
            customerID: "CUST123",
            customerName: "topu",
            customerEmail: "topu@gmail.com",
            customerPhone: "0168256947",
            totalAmount: 59.97,
            district: "mirpur",
            shipAdd: "123 Main Street, Springfield, IL",
            shipMethod: "Standard Shipping",
            payMethod: "Credit Card",
            status: "Cancelled",
            items: [
                {
                    sku: "T12345",
                    pID: "101",
                    pName: "T-Shirts",
                    sPrice: 19.99,
                    orderQty: 3,
                    prodetails: [
                        { ccode: "#ff1f1f", color: "Red", size: "L", qty: 1 },
                        { ccode: "#00ff00", color: "Green", size: "M", qty: 2 }
                    ],
                    orderDate: "2025-01-29",
                    pictures: [
                        "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg",
                        "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF"
                    ]
                },
                {
                    sku: "T12345",
                    pID: "101",
                    pName: "T-Shirts",
                    sPrice: 19.99,
                    orderQty: 3,
                    prodetails: [
                        { ccode: "#ff1f1f", color: "Red", size: "L", qty: 1 },
                        { ccode: "#00ff00", color: "Green", size: "M", qty: 2 }
                    ],
                    orderDate: "2025-01-29",
                    pictures: [
                        "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg",
                        "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF"
                    ]
                }
            ],
        },
        {
            orderID: "ORD001",
            orderDate: "2025-01-29",
            customerID: "CUST123",
            customerName: "hridoy",
            customerEmail: "hridoy@gmail.com",
            customerPhone: "01618702323",
            totalAmount: 59.97,
            district: "dhaka",
            shipAdd: "123 Main Street, Springfield, IL",
            shipMethod: "Standard Shipping",
            payMethod: "Credit Card",
            status: "Cancelled",
            items: [
                {
                    sku: "T12345",
                    pID: "101",
                    pName: "T-Shirts",
                    sPrice: 19.99,
                    orderQty: 3,
                    prodetails: [
                        { ccode: "#ff1f1f", color: "Red", size: "L", qty: 1 },
                        { ccode: "#00ff00", color: "Green", size: "M", qty: 2 }
                    ],
                    orderDate: "2025-01-29",
                    pictures: [
                        "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg",
                        "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF"
                    ]
                },
                {
                    sku: "T12345",
                    pID: "101",
                    pName: "T-Shirts",
                    sPrice: 19.99,
                    orderQty: 3,
                    prodetails: [
                        { ccode: "#ff1f1f", color: "Red", size: "L", qty: 1 },
                        { ccode: "#00ff00", color: "Green", size: "M", qty: 2 }
                    ],
                    orderDate: "2025-01-29",
                    pictures: [
                        "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg",
                        "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF"
                    ]
                }
            ],
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
                    <div>Price</div>
                    <div>Payment Method</div>
                    <div>Items</div>
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
                                <p>${order.totalAmount}</p>
                            </div>
                            <div>
                                <p>{order.payMethod}</p>
                            </div>
                            <div className='flex flex-col'>
                                {order.items.map((item, idx) => (
                                    <div key={item.sku} >
                                        <div className='flex flex-row'>
                                            <p className="prodiv">{item.sku} </p>
                                            <p className="prodiv">{item.pName} </p>
                                            <p className="prodiv">{item.sPrice} </p>
                                            <p className="prodiv">{item.orderQty} </p>
                                        </div>
                                         <div className="flex flex-col">
                                        {item.prodetails.map((detail, detailIdx) => (
                                            <div key={detailIdx} className="flex flex-row">
                                                <p style={{ backgroundColor: detail.ccode }} className="prodiv">{detail.color}</p>
                                                <p className="prodiv">{detail.size}</p>:
                                                <p className="prodiv">{detail.qty}</p>
                                            </div>
                                        ))}
                                   </div> </div>
                                ))}
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

export default PCanOrders;
