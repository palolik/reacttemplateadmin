
import {
  createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/main";
import PSubcategory from "../Layout/Pripacklab/Subcategory/Subcategory";
import PProductlist from "../Layout/Pripacklab/Productlist/Productlist";
import PAddproducts from "../Layout/Pripacklab/Addproducts/Addproducts";
import PComments from "../Layout/Pripacklab/Comments/Comments";
import PReviews from "../Layout/Pripacklab/Reviews/Reviews";
import POrders from "../Layout/POrders/AllOrders/Orders";
import PCategory from "../Layout/Pripacklab/Category/Category";
import PIncome from "../Layout/Pripacklab/Income/Income";
import PExpense from "../Layout/Pripacklab/Expense/Expense";
import Login from "../Layout/Auth/login";
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
import OrderLabel from "../Layout/POrders/AllOrders/OrderLabel";
import PSellers from "../Layout/Pripacklab/Sellers/PSellers";
import GeoLocation from "../Layout/Pripacklab/GeoLocation/GeoLocation";
import AboutUs from "../Layout/Pripacklab/AboutUs/AboutUs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
        loader: ()=> fetch(`${base_url}/admindashboard`),
      },
      {
        path: '/login',
        element: <Login/>
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
        path: '/pripacklab/sellers',
        element: <PSellers />
      },
      {
        path: '/pripacklab/geolocation',
        element: <GeoLocation />
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
           {
        path: "/pripacklab/aboutus",
        element: <AboutUs></AboutUs>,
        loader: ()=> fetch(`${base_url}/aboutus`),
        },
        { path: '/invoice/:orderId',
           element: <Invoice /> },
        { path: '/label/:orderId',
           element: <OrderLabel /> },
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

    ]
  },

]);
