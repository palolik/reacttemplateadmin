import '../../../styles/productview.css';
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { base_url } from '../../../config/config';
const Investments = () => {
    const loaderInvestments = useLoaderData() || [];
    const [investments, setInvestments] = useState(loaderInvestments);

    useEffect(() => {
        fetch(`${base_url}/investments`)
            .then(res => res.json())
            .then(data => setInvestments(data))
            .catch(error => console.error('Error fetching investments:', error));
    }, []);

    return (
        <div className='w-full'>
            <div className='hdr'>Investments</div>
            <div className="overflow-x-auto p-2">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border">Startup Name</th>
                            <th className="p-2 border">Investor</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Round</th>
                            <th className="p-2 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investments.map((inv) => (
                            <tr key={inv._id} className="border-t">
                                <td className="p-2 border">{inv.startupName}</td>
                                <td className="p-2 border">{inv.investor}</td>
                                <td className="p-2 border">{inv.amount}</td>
                                <td className="p-2 border">{inv.round}</td>
                                <td className="p-2 border">{inv.date}</td>
                            </tr>
                        ))}
                        {investments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No investments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Investments;
