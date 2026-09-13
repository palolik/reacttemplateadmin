import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './routes/Routes'
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from './Layout/Provider/Authprovider';
import ThemeProvider from './Layout/Provider/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <HelmetProvider>
        <ThemeProvider>
        <AuthProvider>

          <div className='mx-auto bg-white dark:bg-slate-900'>
            <RouterProvider router={router} />
          </div>
          </AuthProvider>

        </ThemeProvider>
        </HelmetProvider>
  </React.StrictMode>,
)