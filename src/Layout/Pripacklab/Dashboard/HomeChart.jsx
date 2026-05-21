// HomeChart.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { base_url } from "../../../config/config.jsx";

const HomeChart = ({ selectedMonth }) => {
  const [data, setData] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const year = new Date().getFullYear();
        const monthIndex = new Date(`${selectedMonth} 1, ${year}`).getMonth() + 1;
        const monthString = `${year}-${String(monthIndex).padStart(2, "0")}`;
        const res = await fetch(`${base_url}/vcount?month=${monthString}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
          setTotalViews(json.data.reduce((sum, item) => sum + (item.views || 0), 0));
        }
      } catch (err) {
        console.error("Error fetching visitor data:", err);
      }
    };
    fetchVisitors();
  }, [selectedMonth]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{selectedMonth} Views</p>
        <p className="text-xs text-gray-500">Total: <span className="font-bold text-indigo-600">{totalViews}</span></p>
      </div>
      {/* ✅ width="100%" and small fixed height so it fits the grid cell */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="views" fill="#121445" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HomeChart;