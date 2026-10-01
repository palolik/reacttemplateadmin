import { useState, useEffect, useContext } from 'react';
import '../../styles/sidebar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Provider/Authprovider';
import { ThemeContext } from '../Provider/ThemeProvider';
import {
    FiGrid, FiUsers, FiMapPin, FiBox, FiShoppingCart,
    FiDollarSign, FiTrendingUp, FiMessageSquare, FiFileText,
    FiChevronDown, FiChevronLeft, FiChevronRight, FiLogOut,
    FiSun, FiMoon,
} from 'react-icons/fi';
import { TbTruckDelivery } from "react-icons/tb";

const COLLAPSE_KEY = 'sidebar-collapsed';

// This sidebar currently serves a single tab/app ("pripacklab"); the gate
// below stays keyed on that tab so other tabs granted via user.tabs
// (e.g. "roles", "ecommerce") don't unlock these routes.
const TENANT_KEY = 'pripacklab';

const SECTIONS = [
    {
        id: 'overview',
        label: 'Overview',
        icon: FiGrid,
        items: [{ id: 19, name: 'Dashboard', path: '/pripacklab/dashboard' }],
    },
    {
        id: 'Seller Center',
        label: 'Seller Center',
        icon: FiUsers,
        items: [{ id: 20, name: 'Seller List', path: '/pripacklab/sellers' }],
    },
    {
        id: 'geolocation',
        label: 'Geo Location',
        icon: FiMapPin,
        items: [{ id: 21, name: 'Districts & Areas', path: '/pripacklab/geolocation' }],
    },
    {
        id: 'catalogue',
        label: 'Catalogue',
        icon: FiBox,
        items: [
            { id: 1, name: 'Category', path: '/pripacklab/category' },
            { id: 2, name: 'Subcategory', path: '/pripacklab/subcategory' },
            { id: 3, name: 'Product List', path: '/pripacklab/productlist' },
            { id: 4, name: 'Add Product', path: '/pripacklab/addproducts' },
            { id: 24, name: 'Combo Packages', path: '/pripacklab/combos' },
        ],
    },
    {
        id: 'orders',
        label: 'Orders',
        icon: FiShoppingCart,
        items: [
            { id: 5, name: 'All Orders', path: '/pripacklab/allorders' },
            { id: 6, name: 'Delivery Charge', path: '/pripacklab/delivery' },
            { id: 7, name: 'Coupons', path: '/pripacklab/coupons' },
        ],
    },
    {
        id: 'finance',
        label: 'Finance',
        icon: FiDollarSign,
        items: [
            { id: 8, name: 'Income', path: '/pripacklab/Income' },
            { id: 9, name: 'Expense', path: '/pripacklab/Expense' },
            { id: 10, name: 'Payment Methods', path: '/pripacklab/paymentmethod' },
        ],
    },
    {
        id: 'marketing',
        label: 'Marketing',
        icon: FiTrendingUp,
        items: [
            { id: 11, name: 'Banners', path: '/pripacklab/Banners' },
            { id: 12, name: 'Advertisement', path: '/pripacklab/Advertisement' },
            { id: 13, name: 'Social Media', path: '/pripacklab/socialmedia' },
        ],
    },

    
    {
        id: 'customer',
        label: 'Customer',
        icon: FiMessageSquare,
        items: [
            { id: 14, name: 'Support Chat', path: '/pripacklab/support' },
            { id: 15, name: 'Comments', path: '/pripacklab/comments' },
            { id: 16, name: 'Reviews', path: '/pripacklab/reviews' },
            { id: 23, name: 'All Customers', path: '/pripacklab/customers' },
        ],
    },
    {
        id: 'content',
        label: 'Content',
        icon: FiFileText,
        items: [
            { id: 17, name: 'FAQ', path: '/pripacklab/faq' },
            { id: 18, name: 'Ordering Process', path: '/pripacklab/process' },
            { id: 22, name: 'About Us', path: '/pripacklab/aboutus' },
        ],
    },
        {
        id: 'suppliers',
        label: 'Suppliers',
        icon: TbTruckDelivery ,
        items: 
        [{ id: 23, name: 'Supplier List', path: '/pripacklab/suppliers' }],
}
];

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

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

    const [openSection, setOpenSection] = useState(null);
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === 'true');

    // Auto-expand whichever section holds the current route
    useEffect(() => {
        const match = SECTIONS.find((section) =>
            section.items.some((item) => item.path === location.pathname)
        );
        if (match) setOpenSection(match.id);
    }, [location.pathname]);

    useEffect(() => {
        localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    }, [collapsed]);

    const toggleSection = (id) => {
        setOpenSection((prev) => (prev === id ? null : id));
    };

    // Collapsed mode has no room for an inline submenu, so a category
    // click expands the rail back out and opens straight into it.
    const handleCategoryClick = (id) => {
        if (collapsed) {
            setCollapsed(false);
            setOpenSection(id);
        } else {
            toggleSection(id);
        }
    };

    const userTabs = user?.tabs || [];
    const hasAccess = userTabs.includes(TENANT_KEY);

    return (
        <div className={`smain relative transition-[width] duration-200 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
            <button
                onClick={() => setCollapsed((c) => !c)}
                className="stoggle"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <FiChevronRight className="w-3.5 h-3.5" /> : <FiChevronLeft className="w-3.5 h-3.5" />}
            </button>

            <div className={`stop ${collapsed ? 'justify-center px-0' : ''}`}>
                <div className="slogo">P</div>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="stitle">PriPackLab</p>
                        <p className="ssubtitle">Admin Panel</p>
                    </div>
                )}
            </div>

            <nav className="sscroll flex-1 py-3 px-2">
                {hasAccess && SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isDirect = section.items.length === 1;

                    if (isDirect) {
                        const item = section.items[0];
                        return (
                            <NavLink
                                key={section.id}
                                to={item.path}
                                title={collapsed ? section.label : undefined}
                                className={({ isActive }) =>
                                    `snav ${isActive ? 'snav-active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
                                }
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {!collapsed && <span>{section.label}</span>}
                            </NavLink>
                        );
                    }

                    const isOpen = !collapsed && openSection === section.id;
                    const isSectionActive = section.items.some((item) => item.path === location.pathname);

                    return (
                        <div key={section.id} className="mb-1">
                            <button
                                onClick={() => handleCategoryClick(section.id)}
                                title={collapsed ? section.label : undefined}
                                className={`scat ${isSectionActive ? 'scat-active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                            >
                                <span className="flex items-center gap-2.5">
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {!collapsed && section.label}
                                </span>
                                {!collapsed && (
                                    <FiChevronDown
                                        className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                )}
                            </button>

                            {isOpen && (
                                <ul className="mt-0.5 mb-1 flex flex-col gap-0.5 pl-4">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) => `sitem ${isActive ? 'sitem-active' : ''}`}
                                            >
                                                <span className="sdot" />
                                                {item.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="sfooter">
                <div className={`flex items-center gap-2.5 px-2 py-2 ${collapsed ? 'justify-center px-0' : ''}`}>
                    <div className="savatar">{(user?.remail || '?').charAt(0)}</div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-gray-700 dark:text-slate-200 text-[12px] font-medium truncate">{user?.remail}</p>
                            <p className="text-gray-400 dark:text-slate-500 text-[10px]">Administrator</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={toggleTheme}
                    title={collapsed ? (theme === 'dark' ? 'Switch to light' : 'Switch to dark') : undefined}
                    className={`stheme ${collapsed ? 'justify-center px-0' : ''}`}
                >
                    {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                    {!collapsed && (theme === 'dark' ? 'Light mode' : 'Dark mode')}
                </button>
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Logout' : undefined}
                    className={`slogout ${collapsed ? 'justify-center px-0' : ''}`}
                >
                    <FiLogOut className="w-4 h-4" />
                    {!collapsed && 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
