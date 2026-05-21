import '../../../styles/productview.css';
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from 'sweetalert2';
import { base_url } from '../../../config/config';
const Startups = () => {
    const loadercats = useLoaderData() || [];
    const [cats, setcats] = useState(loadercats);

    useEffect(() => {
        fetch(`${base_url}/startups`)
            .then(res => res.json())
            .then(data => setcats(data))
            .catch(error => console.error('Error fetching startups:', error));
    }, []);

    const handleDelete = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${base_url}/delstartups/${_id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            Swal.fire("Deleted!", "The startup has been deleted.", "success");
                            setcats(cats.filter(cat => cat._id !== _id));
                        }
                    })
                    .catch(error => console.error('Error deleting startup:', error));
            }
        });
    };

    return (
        <div className='w-full'>
            <div className='hdr'>All Startups</div>
            <div className="overflow-x-auto p-2">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border">Category</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Website</th>
                            <th className="p-2 border">Model</th>
                            <th className="p-2 border">Investment</th>
                            <th className="p-2 border">Employees</th>
                            <th className="p-2 border">Socials</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cats.map(cat => (
                            <tr key={cat._id} className="border-t">
                                <td className="p-2 border">{cat.catname}</td>
                                <td className="p-2 border">{cat.name}</td>
                                <td className="p-2 border">{cat.email}</td>
                                <td className="p-2 border">{cat.phone}</td>
                                <td className="p-2 border">
                                    <a href={cat.web} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                                        {cat.web}
                                    </a>
                                </td>
                                <td className="p-2 border">{cat.bmodel}</td>
                                <td className="p-2 border">{cat.inv}</td>
                                <td className="p-2 border">{cat.eps}</td>
                                <td className="p-2 border">
                                    {cat.fb && <a href={cat.fbl} target="_blank" rel="noreferrer" className="text-blue-500">FB</a>}&nbsp;
                                    {cat.ins && <a href={cat.insl} target="_blank" rel="noreferrer" className="text-pink-500">IG</a>}&nbsp;
                                    {cat.ln && <a href={cat.lnl} target="_blank" rel="noreferrer" className="text-blue-700">LN</a>}
                                </td>
                                <td className="p-2 border">
                                    <button className="smbut mr-2">Edit</button>
                                    <button onClick={() => handleDelete(cat._id)} className="smbut bg-red-500 hover:bg-red-600 text-white">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cats.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center py-4">No startups found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Startups;
