import { useState } from 'react';
import '../../../styles/productview.css'

const Coupons = () => {


    const couponData = [
        { id: 1, cname: "21stfeb", ccode: "CD10", discount: "10", total:"100", used:"20", status:"pause" },
        { id: 2, cname: "valent", ccode: "CD10", discount: "10", total:"100", used:"20", status:"active" },
        { id: 3, cname: "eid", ccode: "CD10", discount: "10", total:"100", used:"20", status:"active" },
        { id: 4, cname: "eid", ccode: "CD10", discount: "10", total:"100", used:"20", status:"pause" },
       
    ];


    return (
        <div className='w-full'>   
       <div className='hdr'>Coupons</div>
            <div className="flex flex-row p-2  w-full">
                <div className="flex flex-col gap-4 p-2 w-[350px]">
                    <label className="lbl">
                        <div>
                            <span>Coupon name</span>
                        </div>
                        <input type="text" placeholder="Type here"  />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Coupon code</span>
                        </div>
                        <input type="text" placeholder="Type here"  />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>discount</span>
                        </div>
                        <input type="text" placeholder="Type here"  />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>total</span>
                        </div>
                        <input type="text" placeholder="Type here"  />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>used</span>
                        </div>
                        <input type="text" placeholder="Type here"  />
                    </label>
                    <button className='btn mt-10 btn-sm  w-[200px]'>Add Category</button>
                    </div>
                <div className="w-full p-2">
                        <div className="tabst">
                            <div>Coupon name</div>
                            <div>Coupon code </div>
                            <div>Discount</div>
                            <div>Total</div>
                            <div>Used</div>
                            <div>Status</div>
                        </div>
                        <div className="flex flex-col ">
                            {couponData.map((coupon) => (
                                <div key={coupon.id} className="tabc">
                                    <div>
                                        <p>{coupon.cname}</p>
                                    </div>
                                    <div>
                                        <p>{coupon.ccode}</p>
                                    </div>
                                    <div>
                                        <p>{coupon.discount}</p>
                                    </div>
                                    <div>
                                        <p>{coupon.total}</p>
                                    </div>
                                    <div>
                                        <p>{coupon.used}</p>
                                    </div>
                                    <div>
                                        <button className="smbut"> <p>{coupon.status}</p></button>
                                        <button className="smbut">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>
            </div>
        </div>
    );
};
export default Coupons;
