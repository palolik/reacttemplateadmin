import '../../../styles/productview.css';
import Swal from 'sweetalert2';
import { base_url } from '../../../config/config';
const Addstartups = () => {
    const handleAddPost = async (event) => {
        event.preventDefault();
        const form = event.target;

        const getTrimmedValue = (name) => {
            const value = form[name]?.value;
            return value ? value.trim() : '';
        };

        const postData = {
            catname: getTrimmedValue('catname'),
            name: getTrimmedValue('name'),
            logo: getTrimmedValue('logo'),
            est: getTrimmedValue('est'),
            bmodel: getTrimmedValue('bmodel'),
            lic: getTrimmedValue('lic'),
            comd: getTrimmedValue('comd'),
            email: getTrimmedValue('email'),
            phone: getTrimmedValue('phone'),
            web: getTrimmedValue('web'),
            dash: getTrimmedValue('dash'),
            rev: getTrimmedValue('rev'),
            pro: getTrimmedValue('pro'),
            eps: getTrimmedValue('eps'),
            inv: getTrimmedValue('inv'),
            fb: getTrimmedValue('fb'),
            fbl: getTrimmedValue('fbl'),
            ins: getTrimmedValue('ins'),
            insl: getTrimmedValue('insl'),
            ln: getTrimmedValue('ln'),
            lnl: getTrimmedValue('lnl'),
            yt: getTrimmedValue('yt'),
            ytl: getTrimmedValue('ytl'),
            x: getTrimmedValue('x'),
            xl: getTrimmedValue('xl'),
            ggl: getTrimmedValue('ggl'),
            ggll: getTrimmedValue('ggll')
        };

        try {
            const response = await fetch(`${base_url}/addstartups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            if (data.insertedId) {
                Swal.fire({
                    title: "New Startup Added!",
                    text: "You have successfully added a new startup",
                    icon: "success"
                });
                form.reset();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to add the startup. Please check the server logs.",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error('Error adding post:', error);
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred.",
                icon: "error"
            });
        }
    };

    return (
        <div className='w-full'>
            <div className='hdr'>Add Startup</div>
            <div className="flex flex-row p-2 w-full">
                <div className="flex flex-col gap-4 p-2 ">
                    <form onSubmit={handleAddPost}>
                        <div className='flex flex-row flex-wrap gap-5'>
                            {/* Basic Info */}
                            <label className="lbl"><span>Category Name</span><input name="catname" type="text" className="flin" /></label>
                            <label className="lbl"><span>Startup Name</span><input name="name" type="text" className="flin" /></label>
                            <label className="lbl"><span>Logo link</span><input name="logo" type="text" className="flin" /></label>
                            <label className="lbl"><span>Established Year</span><input name="est" type="text" className="flin" /></label>
                            <label className="lbl"><span>Business Model</span><input name="bmodel" type="text" className="flin" /></label>
                            <label className="lbl"><span>License</span><input name="lic" type="text" className="flin" /></label>
                            <label className="lbl"><span>Company Description</span><textarea name="comd" className="flin" /></label>
                        </div>

                        <div className='flex flex-row flex-wrap gap-5'>
                            {/* Contact */}
                            <label className="lbl"><span>Email</span><input name="email" type="email" className="flin" /></label>
                            <label className="lbl"><span>Phone</span><input name="phone" type="text" className="flin" /></label>
                            <label className="lbl"><span>Website</span><input name="web" type="url" className="flin" /></label>
                            <label className="lbl"><span>DashBoard</span><input name="dash" type="url" className="flin" /></label>
                        </div>

                        <div className='flex flex-row flex-wrap gap-5'>
                            {/* Business Stats */}
                            <label className="lbl"><span>Revenue</span><input name="rev" type="text" className="flin" /></label>
                            <label className="lbl"><span>Products</span><input name="pro" type="text" className="flin" /></label>
                            <label className="lbl"><span>Employees</span><input name="eps" type="text" className="flin" /></label>
                            <label className="lbl"><span>Investment</span><input name="inv" type="text" className="flin" /></label>
                        </div>

                        <div className='flex flex-row flex-wrap gap-5'>
                            {/* Social Media */}
                            <label className="lbl"><span>Facebook Name</span><input name="fb" type="text" className="flin" /></label>
                            <label className="lbl"><span>Facebook Link</span><input name="fbl" type="url" className="flin" /></label>
                            <label className="lbl"><span>Instagram Name</span><input name="ins" type="text" className="flin" /></label>
                            <label className="lbl"><span>Instagram Link</span><input name="insl" type="url" className="flin" /></label>
                            <label className="lbl"><span>LinkedIn Name</span><input name="ln" type="text" className="flin" /></label>
                            <label className="lbl"><span>LinkedIn Link</span><input name="lnl" type="url" className="flin" /></label>
                            <label className="lbl"><span>YouTube Name</span><input name="yt" type="text" className="flin" /></label>
                            <label className="lbl"><span>YouTube Link</span><input name="ytl" type="url" className="flin" /></label>
                            <label className="lbl"><span>X (Twitter) Name</span><input name="x" type="text" className="flin" /></label>
                            <label className="lbl"><span>X (Twitter) Link</span><input name="xl" type="url" className="flin" /></label>
                            <label className="lbl"><span>Google Name</span><input name="ggl" type="text" className="flin" /></label>
                            <label className="lbl"><span>Google Link</span><input name="ggll" type="url" className="flin" /></label>
                        </div>

                        {/* Submit */}
                        <button type="submit" className='btn mt-10 btn-sm w-[200px]'>Add Startup</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Addstartups;
