import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";
import { clearStaffSession, getStaffToken, isTokenValid, saveStaffToken } from "../../utils/staffSession";

export const AuthContext = createContext(null);

// `token` is the one from login; renewals only update storage, and every
// request reads the current token from there (see utils/staffSession.js).
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = getStaffToken();
        if (isTokenValid(storedToken)) {
            setToken(storedToken);
            setUser(jwtDecode(storedToken));
        } else {
            clearStaffSession(); // expired: Main sends the person to /login
        }
        setLoading(false);
    }, []);

    const login = (authToken) => {
        saveStaffToken(authToken);
        setToken(authToken);
        setUser(jwtDecode(authToken));
    };

    const logout = () => {
        clearStaffSession();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
