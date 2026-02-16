import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("If this email exists, a reset link was sent.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="text-center mb-3">Forgot Password</h3>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control form-control-lg mb-3"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="text-center mt-3">
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(-1)}
              >
                Back to Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
