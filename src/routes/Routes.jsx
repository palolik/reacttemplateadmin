
import {
  createBrowserRouter, 
} from "react-router-dom";
import Main from "../Layout/main";
import Category from "../Layout/Ecommerce/Category/category";
import Subcategory from "../Layout/Ecommerce/Subcategory/Subcategory";
import Productlist from "../Layout/Ecommerce/Productlist/Productlist";
import Addproducts from "../Layout/Ecommerce/Addproducts/Addproducts";
import Comments from "../Layout/Ecommerce/Comments/Comments";
import Reviews from "../Layout/Ecommerce/Reviews/Reviews";
import SCategory from "../Layout/Skillnup/Category/Category";
import SSubcategory from "../Layout/Skillnup/Subcategory/Subcategory";
import SAddcourse from "../Layout/Skillnup/AddCourse/Addcourse";
import SAddmodules from "../Layout/Skillnup/AddModules/Addmodules";
import Courselist from "../Layout/Skillnup/Courselist/Courselist";
import SComments from "../Layout/Skillnup/Comments/Comments";
import SReviews from "../Layout/Skillnup/Reviews/Reviews";
import PSubcategory from "../Layout/Pripacklab/Subcategory/Subcategory";
import PProductlist from "../Layout/Pripacklab/Productlist/Productlist";
import PAddproducts from "../Layout/Pripacklab/Addproducts/Addproducts";
import PComments from "../Layout/Pripacklab/Comments/Comments";
import PReviews from "../Layout/Pripacklab/Reviews/Reviews";
import EOrders from "../Layout/EOrders/AllOrders/Orders";
import ECanOrders from "../Layout/EOrders/CanOrders/CanOrders";
import EDelOrders from "../Layout/EOrders/DelOrders/DelOrders";
import EPenOrders from "../Layout/EOrders/ShipOrders/ShipOrders";
import POrders from "../Layout/POrders/AllOrders/Orders";
import SOrders from "../Layout/SOrders/AllOrders/Orders";
import SCanOrders from "../Layout/SOrders/CanOrders/CanOrders";
import Income from "../Layout/Accounts/Income/Income";
import Expense from "../Layout/Accounts/Expense/Expense";
import Advertisement from "../Layout/Marketing/Advertisement/Advertisement";
import Coupons from "../Layout/Marketing/Coupons/Coupons";
import Roles from "../Layout/Roles/Roles";
import PCategory from "../Layout/Pripacklab/Category/Category";
import PIncome from "../Layout/Pripacklab/Income/Income";
import PExpense from "../Layout/Pripacklab/Expense/Expense";
import Login from "../Layout/Auth/login";
import Addstartups from "../Layout/Ccinvestments/Addstartups/Addstartups";
import Startups from "../Layout/Ccinvestments/Startups/Startups";
import Investors from "../Layout/Ccinvestments/Investors/Investors";
import Investments from "../Layout/Ccinvestments/Investments/Investments";
import Advertise from "../Layout/Pripacklab/Advertise/Advertise";
import Banners from "../Layout/Pripacklab/Banners/Banners";
import AdminSupport from "../Layout/Pripacklab/SupportChat/AdminSupport";
import Dashboard from "../Layout/Pripacklab/Dashboard/Home";
import Coupon from "../Layout/Pripacklab/Coupons/coupons";
import AddSocial from "../Layout/Pripacklab/Social/Addsocial";
import Process from "../Layout/Pripacklab/Process/process";
import Delivery from "../Layout/Pripacklab/Delivery/delivery";
import FaqAll from "../Layout/Pripacklab/faq/faq";
import { base_url } from "../config/config";
import PaymentMethod from "../Layout/Pripacklab/PaymentMethod/paymentmethod";
import Invoice from "../Layout/Pripacklab/Income/invoice";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/ecommerce/category',
        element: <Category />
      },
      {
        path: '/ecommerce/subcategory',
        element: <Subcategory />
      },
      {
        path: '/ecommerce/productlist',
        element: <Productlist />
      },
      {
        path: '/ecommerce/addproducts',
        element: <Addproducts />
      },
      {
        path: '/ecommerce/comments',
        element: <Comments />
      },
      {
        path: '/ecommerce/reviews',
        element: <Reviews/>
      },
      {
        path: '/skillnup/category',
        element: <SCategory />
      },
      {
        path: '/skillnup/subcategory',
        element: <SSubcategory />
      },
      {
        path: '/skillnup/courselist',
        element: <Courselist />
      },
      {
        path: '/skillnup/addcourse',
        element: <SAddcourse />
      },
      {
        path: '/skillnup/addmodules',
        element: <SAddmodules/>
      },
      {
        path: '/skillnup/comments',
        element: <SComments />
      },
      {
        path: '/skillnup/reviews',
        element: <SReviews/>
      },
      {
        path: '/pripacklab/category',
        element: <PCategory />,
        loader: ()=> fetch(`${base_url}/getcat`),
      },
      {
        path: '/pripacklab/subcategory',
        element: <PSubcategory />,
        loader: ()=> fetch(`${base_url}/getcatnsub`),

      },
      {
        path: '/pripacklab/productlist',
        element: <PProductlist />,
        loader: ()=> fetch(`${base_url}/getproducts`),
      },
      {
        path: '/pripacklab/addproducts',
        element: <PAddproducts />

      },
         {
        path: "/pripacklab/advertisement",
        element: <Advertise></Advertise>,
        loader: ()=> fetch(`${base_url}/advertise`),
        },
           {
        path: "/pripacklab/banners",
        element: <Banners></Banners>,
        loader: ()=> fetch(`${base_url}/getbanners`),
        },
      {
        path: '/pripacklab/income',
        element: <PIncome />
      },
      {
        path: '/pripacklab/expense',
        element: <PExpense 
        
        />
      },
        {
        path: "/pripacklab/support",
        element: <AdminSupport></AdminSupport>,
        loader: ()=> fetch(`${base_url}/adminsupport`),
        },
          {
        path: "/pripacklab/dashboard",
        element: <Dashboard></Dashboard>,
        loader: ()=> fetch(`${base_url}/admindashboard`),
        },

        {
        path: "/pripacklab/coupons",
        element: <Coupon></Coupon>,
        loader: ()=> fetch(`${base_url}/couponshow`),
        },

        {
        path: "/pripacklab/socialmedia",
        element: <AddSocial></AddSocial>,
        loader: ()=> fetch(`${base_url}/socialmedia`),
        },

        {
        path: "/pripacklab/process",
        element: <Process></Process>,
        loader: ()=> fetch(`${base_url}/process`),
        },

        {
        path: "/pripacklab/delivery",
        element: <Delivery></Delivery>,
        loader: ()=> fetch(`${base_url}/delivery`),
        },
           {
        path: "/pripacklab/paymentmethod",
        element: <PaymentMethod></PaymentMethod>,
        loader: ()=> fetch(`${base_url}/payment`),
        },
           {
        path: "/pripacklab/faq",
        element: <FaqAll></FaqAll>,
        loader: ()=> fetch(`${base_url}/faq`),
        },
        { path: '/invoice/:orderId',
           element: <Invoice /> },
      {
        path: '/pripacklab/comments',
        element: <PComments />
      },
      {
        path: '/pripacklab/reviews',
        element: <PReviews/>
      },
      {
        path: 'pripacklab/allorders',
        element: <POrders />
      },
      {
        path: 'ecommerce/orders/allorders',
        element: <EOrders />
      },
      {
        path: 'ecommerce/orders/canorders',
        element: <ECanOrders />
      },
      {
        path: 'ecommerce/orders/delorders',
        element: <EDelOrders />
      },
      {
        path: 'ecommerce/orders/shiporders',
        element: <EPenOrders />
      },

      {
        path: 'skillnup/orders/allorders',
        element: <SOrders />
      },
      {
        path: 'skillnup/orders/canorders',
        element: <SCanOrders />
      },
      {
        path: '/accounts/income',
        element: <Income />
      },
      {
        path: '/accounts/expense',
        element: <Expense />
      },
      {
        path: '/marketing/advertisement',
        element: <Advertisement />
      },
      {
        path: '/marketing/coupons',
        element: <Coupons />
      },
      {
        path: '/roles/roles',
        element: <Roles/>,
        loader: ()=> fetch(`${base_url}/getroles`),

      },
      {
        path: '/ccinvestments/addstartups',
        element: <Addstartups />
      },
      {
        path: '/ccinvestments/startups',
        element: <Startups />,
        loader: ()=> fetch(`${base_url}/startups`),
    
      },
      {
        path: '/ccinvestments/investors',
        element: <Investors />,
        loader: ()=> fetch(`${base_url}/investors`),
      },
      {
        path: '/ccinvestments/investments',
        element: <Investments />,
        loader: ()=> fetch(`${base_url}/investments`),
      },

    ]
  },

]);

