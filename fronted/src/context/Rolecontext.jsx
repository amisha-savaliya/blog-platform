import { createContext, useContext, useEffect, useState } from "react";

const RoleContext = createContext(null);

// Custom hook
export function useRole() {
  return useContext(RoleContext);
}

// Provider component
export function RoleProvider({ children }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/roles")
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <RoleContext.Provider value={{ roles, loading }}>
      {children}
    </RoleContext.Provider>
  );
}
