import { useState } from 'react';
import '../../../styles/productview.css'
import * as XLSX from 'xlsx'; 

const Income = () => {
    // Sample data with unique pid and additional fields like delivery date, category, etc.
    const salesData = [
        { 
            productName: "Shirt", 
            pid: "P1001", // Unique pid
            sprice: 20, 
            quantitySold: 50, 
            deliveryDate: "2025-02-20", 
            category: "Apparel", 
            subcategory: "Tops", 
            buyingPrice: 15 
        },
        { 
            productName: "Pants", 
            pid: "P1002", // Unique pid
            sprice: 30, 
            quantitySold: 40, 
            deliveryDate: "2025-02-22", 
            category: "Apparel", 
            subcategory: "Bottoms", 
            buyingPrice: 20 
        },
        { 
            productName: "Watch", 
            pid: "P1003", // Unique pid
            sprice: 150, 
            quantitySold: 10, 
            deliveryDate: "2025-03-05", 
            category: "Accessories", 
            subcategory: "Wristwear", 
            buyingPrice: 100 
        },
        { 
            productName: "Jacket", 
            pid: "P1004", // Unique pid
            sprice: 100, 
            quantitySold: 15, 
            deliveryDate: "2025-03-10", 
            category: "Apparel", 
            subcategory: "Outerwear", 
            buyingPrice: 60 
        },
        { 
            productName: "Sneakers", 
            pid: "P1005", // Unique pid
            sprice: 80, 
            quantitySold: 25, 
            deliveryDate: "2025-03-15", 
            category: "Footwear", 
            subcategory: "Sports", 
            buyingPrice: 50 
        },
        { 
            productName: "Socks", 
            pid: "P1006", // Unique pid
            sprice: 5, 
            quantitySold: 100, 
            deliveryDate: "2025-02-28", 
            category: "Apparel", 
            subcategory: "Accessories", 
            buyingPrice: 2 
        },
        { 
            productName: "Hat", 
            pid: "P1007", // Unique pid
            sprice: 25, 
            quantitySold: 30, 
            deliveryDate: "2025-03-01", 
            category: "Accessories", 
            subcategory: "Headwear", 
            buyingPrice: 10 
        },
        { 
            productName: "Gloves", 
            pid: "P1008", // Unique pid
            sprice: 15, 
            quantitySold: 60, 
            deliveryDate: "2025-03-12", 
            category: "Accessories", 
            subcategory: "Handwear", 
            buyingPrice: 7 
        },
    ];

     const exportToExcel = () => {
            const data = salesData.map(item => ({
                Category: item.category,
                Subcategory: item.subcategory,
                ProductId: item.pid,
                ProductName: item.productName,
                Price: `${item.sprice}`,
                QuantitySold: item.quantitySold,
                TotalIncomeFromProduct: `${item.sprice * item.quantitySold}`,
                DeliveryDate: item.deliveryDate,
                BuyingPrice: `${item.buyingPrice}`,
                Profit: `${(item.sprice - item.buyingPrice) * item.quantitySold}`,
            }));
    
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Income data");
    
            // Export the file
            XLSX.writeFile(wb, "income_data.xlsx");
        };

    const calculateIncome = () => {
        let totalIncome = 0;
        
        salesData.forEach(item => {
            totalIncome += item.sprice * item.quantitySold;
        });

        return totalIncome;
    };

    return (
        <div className="w-full">
            <h1 className="text-[40px] bg-[#010103] text-white pl-4">Total Income Calculator</h1>
            <div className="bg-[#ffffff] pl-4 m-4 flex flex-row justify-between">
                <div>
                    <button className="smbut mr-2">Import</button>
                    <button className="smbut" onClick={exportToExcel}>Export</button>
                </div>
                <div className='w-[400px]'>
                    <label className="input input-bordered flex input-sm items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                </div>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="tabst">
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Product Id</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity Sold</th>
                        <th>Total Income from Product</th>
                        <th>Delivery Date</th>
                        <th>Buying Price</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.map((item, index) => {
                        const profit = item.sprice - item.buyingPrice; // Calculate profit
                        const totalIncome = item.sprice * item.quantitySold; // Calculate total income from product
                        return (
                            <tr className="tabc" key={index}>
                                <td>{item.category}</td>
                                <td>{item.subcategory}</td>
                                <td>{item.pid}</td>
                                <td>{item.productName}</td>
                                <td>{item.sprice}</td>
                                <td>{item.quantitySold}</td>
                                <td>{totalIncome}</td>
                                <td>{item.deliveryDate}</td>
                                <td>{item.buyingPrice}</td>
                                <td>${profit * item.quantitySold}</td> {/* Total profit */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="total-income">
                <p><strong>Total Income: ${calculateIncome()}</strong></p>
            </div>
        </div>
    );
};

export default Income;
