import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { base_url } from "../../../config/config.jsx";
import ChartCard from "./ChartCard.jsx";
import {
  FiBox, FiShoppingCart, FiUsers, FiStar,
  FiDollarSign, FiTrendingDown, FiTrendingUp, FiEye,
} from "react-icons/fi";

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const StatCard = ({ label, value, color = '#4f46e5', icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    transition={{ type: 'spring', stiffness: 200 }}
    className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 border border-gray-100"
  >
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        <Icon className="w-4 h-4" />
      </span>
    </div>
    <div className="text-3xl font-bold text-[#121445]">{value}</div>
  </motion.div>
);

const SectionTitle = ({ title }) => (
  <h2 className="text-md font-semibold text-gray-700 mb-1 mt-1">{title}</h2>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${base_url}/admindashboard`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse">Loading dashboard...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">Failed to load dashboard data.</div>;

  const topStatCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: FiBox, color: '#4f46e5' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingCart, color: '#06b6d4' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: FiUsers, color: '#8b5cf6' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: FiStar, color: '#f59e0b' },
    { label: 'Total Income', value: `${stats.totalIncome.toLocaleString()}৳`, icon: FiDollarSign, color: '#10b981' },
    { label: 'Total Expenses', value: `${stats.totalExpense.toLocaleString()}৳`, icon: FiTrendingDown, color: '#ef4444' },
    { label: 'Net Profit', value: `${stats.netProfit.toLocaleString()}৳`, icon: FiTrendingUp, color: '#10b981' },
    { label: 'Product Views', value: stats.totalProductViews, icon: FiEye, color: '#06b6d4' },
  ];

  const orderPieData = Object.entries(stats.orderStatusMap || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full">
      <div className="hdr">Dashboard</div>

      <div className=" bg-gradient-to-br from-gray-50 via-white to-gray-100 p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <motion.div
            className="grid grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            {topStatCards.map(card => (
              <StatCard key={card.label} {...card} />
            ))}
          </motion.div>



          <div>
            <SectionTitle title="Recent Orders" />
            <div className="bg-white  shadow-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-1 py-1 text-left">Buyer</th>
                    <th className="px-1 py-1 text-left">Items</th>
                    <th className="px-1 py-1 text-left">Total</th>
                    <th className="px-1 py-1 text-left">Payment</th>
                    <th className="px-1 py-1 text-left">Status</th>
                    <th className="px-1 py-1 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-1 py-1">
                        <p className="font-medium">{order.buyerName}</p>
                        <p className="text-gray-400 text-xs">{order.buyerEmail}</p>
                      </td>
                      <td className="px-1 py-1 text-gray-600">
                        {order.cartItems?.map(ci => ci.productName).join(', ')}
                      </td>
                      <td className="px-1 py-1 font-semibold text-green-600">
                        ${Number(order.totalPrice).toLocaleString()}
                      </td>
                      <td className="px-1 py-1 text-gray-500">{order.paymentMethod}</td>
                      <td className="px-1 py-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.currentStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.currentStatus === 'Placed' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'}`}>
                          {order.currentStatus}
                        </span>
                      </td>
                      <td className="px-1 py-1 text-gray-400 text-xs">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>






        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          <div className="h-[300px]">
            <SectionTitle title="Monthly Income vs Expense (Last 6 Months)" />
            <div className="bg-white  shadow-md p-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={v => `${v.toLocaleString()}৳`} />
                  <Legend />
                  <Bar dataKey="income" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="h-[300px]">
            <SectionTitle title="Income by Category" />
            <div className="bg-white  shadow-md p-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.incomeByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={v => `${v}৳`} />
                  <YAxis type="category" dataKey="_id" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {stats.incomeByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-[300px]">
            <SectionTitle title="Expenses by Category" />
            <div className="bg-white  shadow-md p-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.expenseByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={v => `${v}৳`} />
                  <YAxis type="category" dataKey="_id" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {stats.expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          <div>
            <SectionTitle title="Orders by Status" />
            <div className="bg-white  shadow-md p-2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={orderPieData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={90} innerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {orderPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div >
            <div className="flex items-center justify-between">
              <SectionTitle title='Most Viewed Products' />
              <span className="text-xs text-gray-400">Total views: <strong className="text-gray-700">{stats.totalProductViews}</strong></span>
            </div>
            <div className="bg-white  shadow-md p-2">
              {(stats.topViewedProducts || []).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">

                  {/* Rank */}
                  <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>

                  {/* Thumbnail */}
                  {product.mainPic ? (
                    <img
                      src={`${base_url}${product.mainPic}`}
                      alt={product.productName}
                      className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                      <FiBox className="w-4 h-4" />
                    </div>
                  )}

                  {/* Name & category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.productName}</p>
                    <p className="text-xs text-gray-400 truncate">{product.category}</p>
                  </div>

                  {/* View bar */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${Math.round((product.viewCount / (stats.topViewedProducts[0]?.viewCount || 1)) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 w-8 text-right">{product.viewCount}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle title="Visitor Analytics" />
            <ChartCard />


          </div>
        </div>
        {/* ── Top Viewed Products ── */}

      </div>
    </div>
  );
};

export default Dashboard;