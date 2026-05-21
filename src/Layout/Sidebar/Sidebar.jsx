/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react';
import '../../styles/sidebar.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/Authprovider';

const ListLink = ({ route, listClass, isActive }) => {
    return (
        <li>
            <a
                href={route.path}
                className={`${listClass} ${isActive ? 'bg-[#141414] text-sky-300' : ''}`}
            >
                {route.name}
            </a>
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
        ecommerce: [
            { id: 1, name: 'Category',     path: '/ecommerce/dashboard' },
            { id: 2, name: 'Category',     path: '/ecommerce/category' },
            { id: 3, name: 'Subcategory',  path: '/ecommerce/subcategory' },
            { id: 4, name: 'Product List', path: '/ecommerce/productlist' },
            { id: 5, name: 'Add Product',  path: '/ecommerce/addproducts' },
            { id: 6, name: 'Comments',     path: '/ecommerce/comments' },
            { id: 7, name: 'Reviews',      path: '/ecommerce/reviews' },
        ],
        eorders: [
            { id: 1, name: 'All Orders',        path: '/ecommerce/orders/allorders' },
            { id: 2, name: 'Cancelled Orders',   path: '/ecommerce/orders/canorders' },
            { id: 3, name: 'On Shipment',        path: '/ecommerce/orders/shiporders' },
            { id: 4, name: 'Delivered Orders',   path: '/ecommerce/orders/delorders' },
        ],
        skillnup: [
            { id: 1, name: 'Course Category',    path: '/skillnup/category' },
            { id: 2, name: 'Course Subcategory', path: '/skillnup/subcategory' },
            { id: 3, name: 'Add Course',         path: '/skillnup/addcourse' },
            { id: 4, name: 'Add Modules',        path: '/skillnup/addmodules' },
            { id: 5, name: 'Course List',        path: '/skillnup/courselist' },
            { id: 6, name: 'Comments',           path: '/skillnup/comments' },
            { id: 7, name: 'Reviews',            path: '/skillnup/reviews' },
        ],
        sorders: [
            { id: 1, name: 'All Orders',       path: '/skillnup/orders/allorders' },
            { id: 2, name: 'Cancelled Orders', path: '/skillnup/orders/canorders' },
        ],

        // ── pripacklab: grouped sub-sections ──────────────────
        pripacklab: {
            _grouped: true,
            sections: [
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
                {
                    id: 'overview',
                    label: 'Overview',
                    items: [
                        { id: 19, name: 'Dashboard', path: '/pripacklab/dashboard' },
                    ],
                },
            ],
        },

        marketing: [
            { id: 1, name: 'Coupon code',    path: '/marketing/coupons' },
            { id: 2, name: 'Advertisement',  path: '/marketing/advertisement' },
        ],
        accounts: [
            { id: 1, name: 'Income',  path: '/accounts/income' },
            { id: 2, name: 'expense', path: '/accounts/expense' },
        ],
        roles: [
            { id: 1, name: 'Roles', path: '/roles/roles' },
              ],
        ccinvestment: [
            { id: 1, name: 'Startups',    path: '/ccinvestments/startups' },
            { id: 2, name: 'Add Startups', path: '/ccinvestments/addstartups' },
            { id: 3, name: 'Investors',   path: '/ccinvestments/investors' },
            { id: 4, name: 'Investments', path: '/ccinvestments/investments' },
        ],
    };

    const clsList = 'btn bg-[#121445] hover:bg-[#1b1e70] text-white border-0 w-full mt-1';
    const clsSubBtn = 'btn bg-[#0d0f33] hover:bg-[#181b5e] text-sky-200 border-0 w-full mt-1 text-xs justify-between';

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
           

            {Object.keys(routes).map((section) => {
                if (!userTabs.includes(section)) return null;
                const def = routes[section];

                return (
                    <div key={section} className="sdiv">
                        <input
                            type="radio"
                            name="my-accordion-2"
                            checked={activeSection === section}
                            onChange={() => handleSectionToggle(section)}
                        />
                        <div className="collapse-title text-white text-m text-center border-b-[1px] border-cyan-100 rounded-none bg-black h-4">
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </div>

                        {activeSection === section && (
                            <div className="collapse-content m-0 p-0 bg-[#121445]">

                                {/* ── Grouped (pripacklab-style) ── */}
                                {def._grouped ? (
                                    <div className="flex flex-col p-1 gap-0.5">
                                        {def.sections.map((sub) => (
                                            <div key={sub.id}>
                                                {/* Sub-section toggle button */}
                                                <button
                                                    onClick={() => handleSubToggle(sub.id)}
                                                    className={clsSubBtn}
                                                >
                                                    <span>{sub.label}</span>
                                                    <span className="text-[10px] opacity-60">
                                                        {activeSubSection === sub.id ? '▲' : '▼'}
                                                    </span>
                                                </button>

                                                {/* Sub-section items */}
                                                {activeSubSection === sub.id && (
                                                    <ul className="flex flex-col pl-2 pr-1 py-1 gap-0 bg-[#0a0c28]">
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
                                    <ul className="flex flex-col p-1">
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

            <div
                className="collapse-title text-white text-m text-center border-b-[1px] border-cyan-100 rounded-none bg-black h-4"
                onClick={handleLogout}
            >
                Logout
            </div>
        </div>
    );
};

export default Sidebar;