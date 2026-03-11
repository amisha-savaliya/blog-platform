import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {  useSelector } from "react-redux";

export default function Signup() {
  const navigate = useNavigate();
const { roles,loading,error}=useSelector((s)=>s.roles);


  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    uname: "",
    email: "",
    password: "",
    confirm: "",
    role: "",
  });



 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("FORM DATA:", form);


    if (!form.uname || !form.email || !form.password || !form.role) return null;

    if (form.password !== form.confirm) {
      return alert("Passwords do not match");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

  

    try {
      const res = await fetch("http://localhost:5000/blog/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uname: form.uname,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();
      // console.log(data)

      if (!res.ok) {
        setLoading(false);
        return alert(data.msg || "Signup failed");
      }

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 mt-16">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="text-center fw-bold mb-2">Create Account</h3>
              <p className="text-center text-muted mb-4">
                Start your blogging journey today
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="uname"
                    className="form-control"
                    placeholder="John Doe"
                    value={form.uname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-primary w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account?</span>{" "}
                <span
                  className="text-primary fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
