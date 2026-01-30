import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const impersonateToken=sessionStorage.getItem("impersonationToken")
  const activeToken=impersonateToken || token


useEffect(() => {


  if (activeToken) {
    try {
      const decoded = jwtDecode(activeToken);
      setUser(decoded);
    } catch (err) {
      setUser(null);
    }
  } else {
    setUser(null);
  }
}, []);






  const logout = () => {
    fetch("http://localhost:5000/logout", {
      headers: { Authorization: "Bearer " + token },
    })
      .finally(() => {
        localStorage.removeItem("token");
         localStorage.removeItem("impersonationToken")
        setUser(null);
      });
  };



  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
