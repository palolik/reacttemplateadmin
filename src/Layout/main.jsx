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
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-row bg-white">
      {!isLoginPage && <Sidebar />} 
      <Outlet  /> 
    </div>
  );
};

export default Main;
