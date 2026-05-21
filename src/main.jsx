import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './routes/Routes'
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from './Layout/Provider/Authprovider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <HelmetProvider>
        <AuthProvider>

          <div className=' mx-auto bg-white'>
            <RouterProvider router={router} />
          </div>
          </AuthProvider>

        </HelmetProvider>
  </React.StrictMode>,
)