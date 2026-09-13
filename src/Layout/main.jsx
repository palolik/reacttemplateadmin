import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { AuthContext } from "./Provider/Authprovider";

const Main = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      navigate('/login');
    }
  }, [user, loading, isLoginPage, navigate]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-row bg-white dark:bg-slate-900 h-screen overflow-hidden">
      {!isLoginPage && <Sidebar />}
      <div className="flex-1 h-screen overflow-y-auto text-gray-900 dark:text-slate-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
