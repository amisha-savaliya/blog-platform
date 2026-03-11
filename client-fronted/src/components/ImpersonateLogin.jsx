import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ImpersonateLogin() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) return;

    // Fetch impersonated user profile
    fetch("http://localhost:5000/blog/users/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        // ONLY update redux state
        sessionStorage.setItem("impersonateToken",token)
        dispatch(
          setCredentials({
            user: data.user,
            token: token,
          })
        );

        navigate("/profile");
      })
      .catch((err) => {
        console.error("Impersonation failed:", err);
      });
  }, [dispatch, navigate, params]);

  return <p>Logging you in...</p>;
}