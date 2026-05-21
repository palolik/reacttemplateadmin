import '../../../styles/productview.css'

const Subcategory = () => {



    const productData = [
        { id: 1, cid: "1", cname: "Shirts", scname: ['T-shirts', 'Polos', 'Dress Shirts']  },
        { id: 2, cid: "2", cname: "Pants", scname:  ['Jeans', 'Chinos', 'Shorts']},
        { id: 3, cid: "3", cname: "Polo Shirts", scname: ['Caps', 'Beanies', 'Fedoras'] },

    ];


    return (
        <div className='w-full flex flex-col'>
            <div className='hdr'>Sub Category</div>
            <div className="flex flex-row  w-full p-2">
                <div className="flex flex-col w-[350px] ">
                    <label className="lbl">
                        <div className="label">
                            <span className="label-text">Category Name</span>
                        </div>
                        <select className="slt">
                            <option>Shirts</option>
                            <option>Pants</option>
                            <option>Hats</option>
                        </select>
                    </label>
                    <label className="lbl">
                        <div className="label">
                            <span className="label-text">Sub Category Name</span>
                        </div>
                        <input type="text" placeholder="Type here" className="fin" />
                    </label>
               <button className='btn mt-10 btn-sm  w-[200px]'>Add Subcategory</button>
                </div>
                <div className='w-full '>
                    <div className="tabst">
                        <div>S No.</div>
                        <div>Category Name</div>
                        <div>Sub Category Name</div>
                    </div>
                    <div className="flex flex-col m-2">
                        {productData.map((product) => (
                            <div key={product.id} className="tabc">
                                <div>
                                    <p>{product.cid}</p>
                                </div>
                                <div>
                                    <p>{product.cname}</p>
                                </div>
                                <div>
                                    <p>{product.scname}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Subcategory;