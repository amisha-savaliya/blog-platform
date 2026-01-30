import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function UserProfile() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load token on mount
  useEffect(() => {
    const t = localStorage.getItem("impersonationToken");
    if (t) {
      setToken(t);
      setUser(jwtDecode(t));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("impersonationToken");
    setToken(null);    
    setUser(null);
    navigate("/admin/users", { replace: true });
  };

  if (!user) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mb-4 h-100">
        <div className="d-flex align-items-center gap-4 mb-1">
          <img
            src="/user.png"
            className="rounded-circle"
            width="100"
            height="100"
            alt="user"
          />
        </div>
        {/* <h1>{user.name}</h1> */}
         <h3>{user.name}</h3>
            <p className="text-muted fw-semibold mb-1">{user.email}</p>
            <small className="text-muted">
              Joined :{(user.created_at)}
            </small>
      </div>

      {token && (
        <div className="alert alert-warning text-center">
          Admin is viewing as this user
          <button onClick={logout} className="btn btn-sm btn-dark ms-2">
            Return to Admin
          </button>
        </div>
      )}
    </div>
  );
}
