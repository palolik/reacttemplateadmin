import { useState } from 'react';
import '../../../styles/productview.css'

const SCategory = () => {


    const productData = [
        { id: 1, cid: "1", cname: "Web Development", cimg: "https://www.thehub.in/wp-content/uploads/2022/08/5-WAYS-TO-WEAR-PRINTED-SHIRTS-DURING-THE-SUMMER-SEASON.jpg", iimg: "https://cdn-icons-png.flaticon.com/512/5258/5258035.png", himg: "https://www.thehub.in/wp-content/uploads/2022/08/5-WAYS-TO-WEAR-PRINTED-SHIRTS-DURING-THE-SUMMER-SEASON.jpg" },
        { id: 2, cid: "2", cname: "App Development", cimg: "https://www.thehub.in/wp-content/uploads/2022/08/5-WAYS-TO-WEAR-PRINTED-SHIRTS-DURING-THE-SUMMER-SEASON.jpg", iimg: "https://cdn-icons-png.flaticon.com/512/5258/5258035.png", himg: "https://www.thehub.in/wp-content/uploads/2022/08/5-WAYS-TO-WEAR-PRINTED-SHIRTS-DURING-THE-SUMMER-SEASON.jpg" },
        { id: 3, cid: "3", cname: "Graphic Design", cimg: "https://www.thehub.in/wp-content/uploads/2022/08/5-WAYS-TO-WEAR-PRINTED-SHIRTS-DURING-THE-SUMMER-SEASON.jpg", iimg: "https://cdn-icons-png.flaticon.com/512/5258/5258035.png", himg: "https://www.thehub.in/wp-content/uploads/2022/08/5-WAYS-TO-WEAR-PRINTED-SHIRTS-DURING-THE-SUMMER-SEASON.jpg" },

    ];


    return (
        <div className='w-full'>   
       <div className='hdr'>Course Category</div>
            <div className="flex flex-row p-2  w-full">
                <div className="flex flex-col gap-4 p-2 w-[350px]">
                    <label className="lbl">
                        <div>
                            <span>Category Name</span>
                        </div>
                        <input type="text" placeholder="Type here"  />
                    </label>
                    <label className="lbl">
                        <div>
                            <span>Pick Cover picture</span>

                        </div>
                        <input type="file" className="flin" />

                    </label>
                    <label className="lbl">
                        <div>
                            <span>Pick icon picture</span>

                        </div>
                        <input type="file" className="flin" />

                    </label>
                    <label className="lbl">
                        <div>
                            <span>Pick home cover picture</span>
                        </div>
                        <input type="file" className="flin" />
                    </label>

                    <button className='btn mt-10 btn-sm  w-[200px]'>Add Category</button>
                    </div>
                <div className="w-full p-2">
                        <div className="tabst">
                            <div>S No.</div>
                            <div>Category </div>
                            <div>Cover</div>
                            <div>details Page cover</div>
                            <div>Icon</div>
                            <div>Action Buttons</div>
                        </div>
                        <div className="flex flex-col ">
                            {productData.map((product) => (
                                <div key={product.id} className="tabc">
                                    <div>
                                        <p>{product.cid}</p>
                                    </div>
                                    <div>
                                        <p>{product.cname}</p>
                                    </div>
                                    <div>
                                        <img className="w-[120px] h-[80px] " src={product.cimg} />
                                    </div>
                                    <div>
                                        <img className="w-[200px] h-[50px] " src={product.himg} />
                                    </div>
                                    <div>
                                        <img className="w-[50px] h-[50px] " src={product.iimg} />
                                    </div>
                                    <div>
                                        <button className="smbut">Edit</button>
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
export default SCategory;
