import '../../../styles/productview.css';
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { base_url } from "../../../config/config";

const PCustomers = () => {
  const loaderCustomers = useLoaderData([]);
  const [customers, setCustomers] = useState(loaderCustomers);

  useEffect(() => {
    fetch(`${base_url}/getcustomers`)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  return (
    <div className="w-full">
      <div className="hdr">All Customers</div>

      <div className="w-full p-2">
        <div className="bg-white pl-2 mb-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">{customers.length} customer(s)</span>
        </div>

        <div className="tabst">
          <div>Name</div>
          <div>Phone</div>
          <div>Email</div>
          <div>Address</div>
          <div>Status</div>
          <div>Joined</div>
        </div>

        <div className="flex flex-col">
          {customers.map((customer) => (
            <div key={customer._id} className="tabc">
              <div>{customer.name || "—"}</div>
              <div>{customer.phone || "—"}</div>
              <div>{customer.email || "—"}</div>
              <div>{customer.address || "—"}</div>
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  customer.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {customer.status || "—"}
                </span>
              </div>
              <div>
                {customer.dateCreated
                  ? new Date(customer.dateCreated).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : "—"}
              </div>
            </div>
          ))}

          {customers.length === 0 && (
            <div className="text-center py-6 text-gray-400">No customers yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PCustomers;
