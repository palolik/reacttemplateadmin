import '../../../styles/productview.css'


import { useState } from "react";
const Productlist = () => {
    const productData = [
        {
            slNo: 1,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 2,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 3,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 4,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 5,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 6,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 7,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 8,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },
        {
            slNo: 9,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 10,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 11,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 12,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 13,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 14,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 15,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 16,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },  {
            slNo: 17,
            sku: "T12345",
            pID: "101",
            pName: "T-Shirts",
            pCat: "Clothing",
            psubCat: "Clothing",
            desc: "this is the description for the product that i have listed",
            supplier: "Fashion Inc.",
            pPrice: 12.50,
            sPrice: 19.99,
            profit: 7.00,
            stock: [
                {ccode: "#ff1f1f", color: "Red", size: "L", qty: 40 },
                {ccode: "#006600", color: "Green", size: "M", qty: 50 },
                {ccode: "#2f90ff", color: "Blue", size: "XXL", qty: 10 }
            ],
            tqty: 100,
           
            stockDate: "2025-02-15",
            location: "Warehouse A, Shelf 3",
            pictures: [
                "https://cdn.dramashirt.com/2022/09/Cartoon-Cover-Home-Alone-Christmas-T-shirt.jpg", // Picture 1
                "https://i5.walmartimages.com/seo/Home-Alone-Wet-Bandits-Blue-T-Shirt-Marv-Christmas-Design-with-Gold-Trim_6ccadf22-7cc8-4eb1-9819-6f6ed2497eaa.5ca0f016a8a14888ce7ccf1d78f1fa74.jpeg?odnHeight=320&odnWidth=320&odnBg=FFFFFF", // Picture 2
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OlhRUFw6xeg7UuFov6MfgqEVz7qzd8k2j2-FfPfE49GC3BszeY5NeHhIsWcn4HeB-s8&usqp=CAU", // Picture 3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_w2q72uZzRQ39lD1emz6SLs_kyAnslXSsvTSuhTror1sITOF0C511WrRSuTjSF5mG_g&usqp=CAU", // Picture 4
                "https://m.media-amazon.com/images/I/A16YlCTQRlL._CLa%7C2140%2C2000%7C61LK-Il%2BvBL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png", // Picture 5
                "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C81kENipjBxL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_AC_SY350_QL65_.png"  // Picture 6
            ]
        },

    ];
  
    const productsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = productData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(productData.length / productsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
          <div className="w-full">
                <div className='headr'>Product list</div>
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
                <div>S No.</div>
                <div>PID</div>
                <div>Product Name</div>
                <div>Category</div>
                <div>Sub Category</div>
                <div>Description</div>
                <div>Pictures</div>
                <div>Supplier</div>
                <div>Stock (Color/Size)</div>
                <div>P Price</div>
                <div>S Price</div>
                <div>Profit</div>
                <div>Action Buttons</div>
            </div>
            <div className="flex flex-col m-2">
                {currentProducts.map((product) => (
                    <div key={product.pID} className="tabc">
                        <div>
                            <p>{product.pID}</p>
                        </div>
                        <div>
                            <p>{product.slNo}</p>
                        </div>
                        <div>
                            <p>{product.pName}</p>
                        </div>
                        <div>
                            <p>{product.pCat}</p>
                        </div>
                        <div>
                            <p>{product.psubCat}</p>
                        </div>
                        <div>
                            <p className='w-28'>{product.desc}</p>
                        </div>
                        <div>
                        <div className="flex flex-row flex-wrap w-28 ">
                            {product.pictures.map((img, idx) => (
                                <img key={idx} src={img} alt={`${idx + 1}`} className="w-[30px] h-[30px] object-cover" />
                            ))}
                        </div>
                        </div>
                       
                        <div>
                            <p>{product.supplier}</p>
                        </div>
                    
                            <p>
                                {product.stock.map((item, idx) => (
                                    <div key={idx} className='flex flex-row'>
                                        <p className="prodiv"  style={{ backgroundColor: item.ccode }}>{item.color}</p>  <p className="prodiv">{item.size}</p>: <p className="prodiv">{item.qty}</p> <br />
                                    </div>
                                ))}
                            </p>
                        
                        
                            <p>${product.pPrice}</p>
                        
                    
                            <p>${product.sPrice}</p>
                        
                        
                            <p>${product.profit}</p>
                        
                        <div>
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

export default Productlist;
