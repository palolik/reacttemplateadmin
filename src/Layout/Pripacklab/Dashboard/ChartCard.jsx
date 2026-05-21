// ChartCard.jsx
import { useState } from "react";
import HomeChart from "./HomeChart";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const ChartCard = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

  return (
    <div className="flex flex-col gap-3 bg-white h-[250px] shadow-md p-2">
      <div className="flex items-center gap-2">
        <label htmlFor="months" className="text-xs text-gray-500">Month</label>
        <select
          id="months"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400"
        >
          {months.map((month, i) => (
            <option key={i} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <HomeChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default ChartCard;