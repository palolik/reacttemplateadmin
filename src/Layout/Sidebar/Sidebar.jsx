/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react';
import '../../styles/sidebar.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Provider/Authprovider';

const ListLink = ({ route, listClass, isActive }) => {
    return (
        <li>
            <Link
                to={route.path}
                className={`${listClass} ${
                    isActive
                        ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-medium'
                        : 'border-l-2 border-transparent'
                }`}
            >
                {route.name}
            </Link>
        </li>
    );
};
const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.remail) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    const [activeSection, setActiveSection] = useState(null);
    const [activeSubSection, setActiveSubSection] = useState(null);

    const routes = {
        pripacklab: {
            _grouped: true,
            sections: [
                 {
                    id: 'overview',
                    label: 'Overview',
                    items: [
                        { id: 19, name: 'Dashboard', path: '/pripacklab/dashboard' },
                    ],
                },
                 {
                    id: 'Seller Center',
                    label: 'Seller Center',
                    items: [
                        { id: 20, name: 'Seller List', path: '/pripacklab/sellers' },
                    ],
                },
                {
                    id: 'geolocation',
                    label: 'Geo Location',
                    items: [
                        { id: 21, name: 'Districts & Areas', path: '/pripacklab/geolocation' },
                    ],
                },
                {
                    id: 'catalogue',
                    label: 'Catalogue',
                    items: [
                        { id: 1, name: 'Category',     path: '/pripacklab/category' },
                        { id: 2, name: 'Subcategory',  path: '/pripacklab/subcategory' },
                        { id: 3, name: 'Product List', path: '/pripacklab/productlist' },
                        { id: 4, name: 'Add Product',  path: '/pripacklab/addproducts' },
                    ],
                },
                {
                    id: 'orders',
                    label: 'Orders',
                    items: [
                        { id: 5, name: 'All Orders',      path: '/pripacklab/allorders' },
                        { id: 6, name: 'Delivery Charge', path: '/pripacklab/delivery' },
                        { id: 7, name: 'Coupons',         path: '/pripacklab/coupons' },
                    ],
                },
                {
                    id: 'finance',
                    label: 'Finance',
                    items: [
                        { id: 8, name: 'Income',  path: '/pripacklab/Income' },
                        { id: 9, name: 'Expense', path: '/pripacklab/Expense' },
                         { id: 10, name: 'Payment Methods', path: '/pripacklab/paymentmethod' },
                    ],
                },
                {
                    id: 'marketing',
                    label: 'Marketing',
                    items: [
                        { id: 11, name: 'Banners',        path: '/pripacklab/Banners' },
                        { id: 12, name: 'Advertisement',  path: '/pripacklab/Advertisement' },
                        { id: 13, name: 'Social Media',   path: '/pripacklab/socialmedia' },
                    ],
                },
                {
                    id: 'customer',
                    label: 'Customer',
                    items: [
                        { id: 14, name: 'Support Chat', path: '/pripacklab/support' },
                        { id: 15, name: 'Comments',     path: '/pripacklab/comments' },
                        { id: 16, name: 'Reviews',      path: '/pripacklab/reviews' },
                    ],
                },
                {
                    id: 'content',
                    label: 'Content',
                    items: [
                        { id: 17, name: 'FAQ',              path: '/pripacklab/faq' },
                        { id: 18, name: 'Ordering Process', path: '/pripacklab/process' },
                    ],
                },

            ],
        },
    };

    const clsList =
        'flex items-center h-9 px-3 rounded-md text-[13px] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full';
    const clsSubBtn =
        'flex items-center justify-between h-9 px-3 rounded-md text-[13px] font-medium text-slate-200 hover:bg-slate-800/60 hover:text-white transition-colors w-full';

    // Auto-open section & sub-section based on current path
    useEffect(() => {
        const currentPath = window.location.pathname;
        Object.keys(routes).forEach((section) => {
            const def = routes[section];
            if (def._grouped) {
                def.sections.forEach((sub) => {
                    if (sub.items.some((r) => r.path === currentPath)) {
                        setActiveSection(section);
                        setActiveSubSection(sub.id);
                    }
                });
            } else {
                if (def.some((r) => r.path === currentPath)) {
                    setActiveSection(section);
                }
            }
        });
    }, []);

    const handleSectionToggle = (section) => {
        setActiveSection(activeSection === section ? null : section);
        setActiveSubSection(null);
    };

    const handleSubToggle = (subId) => {
        setActiveSubSection(activeSubSection === subId ? null : subId);
    };

    const userTabs = user?.tabs || [];

    return (
        <div className="smain">
            <div className="h-14 flex items-center px-4 border-b border-slate-800/80 shrink-0">
                <span className="text-white text-sm font-semibold tracking-wide">Admin Panel</span>
            </div>

            <div className="flex-1 py-2">
                {Object.keys(routes).map((section) => {
                    if (!userTabs.includes(section)) return null;
                    const def = routes[section];

                    return (
                        <div key={section} className="sdiv">
                            <div
                                className="sudiv"
                                onClick={() => handleSectionToggle(section)}
                            >
                                <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                                <span className="text-[10px] opacity-50">
                                    {activeSection === section ? '▲' : '▼'}
                                </span>
                            </div>

                            {activeSection === section && (
                                <div className="spdiv">

                                    {/* ── Grouped (pripacklab-style) ── */}
                                    {def._grouped ? (
                                        <div className="flex flex-col px-2 gap-0.5">
                                            {def.sections.map((sub) => (
                                                <div key={sub.id}>
                                                    {/* Sub-section toggle button */}
                                                    <button
                                                        onClick={() => handleSubToggle(sub.id)}
                                                        className={clsSubBtn}
                                                    >
                                                        <span>{sub.label}</span>
                                                        <span className="text-[10px] opacity-50">
                                                            {activeSubSection === sub.id ? '▲' : '▼'}
                                                        </span>
                                                    </button>

                                                    {/* Sub-section items */}
                                                    {activeSubSection === sub.id && (
                                                        <ul className="flex flex-col gap-0.5 pl-3 pr-0 py-1">
                                                            {sub.items.map((route) => (
                                                                <ListLink
                                                                    key={route.id}
                                                                    route={route}
                                                                    listClass={clsList}
                                                                    isActive={window.location.pathname === route.path}
                                                                />
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* ── Flat list (all other sections) ── */
                                        <ul className="flex flex-col gap-0.5 px-2">
                                            {def.map((route) => (
                                                <ListLink
                                                    key={route.id}
                                                    route={route}
                                                    listClass={clsList}
                                                    isActive={window.location.pathname === route.path}
                                                />
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 mx-2 mb-3 mt-1 px-3 h-9 rounded-md text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors shrink-0"
            >
                Logout
            </button>
        </div>
    );
};

export default Sidebar;