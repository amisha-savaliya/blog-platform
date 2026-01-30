import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  return token ? children : <Navigate to="/login" />;
};

export default UserRoute;
