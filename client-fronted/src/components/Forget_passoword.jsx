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
      const res = await fetch("http://localhost:5000/blog/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("If this email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4">
        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="fw-bold">Forgot Password</h3>
              <p className="text-muted small mb-0">
                Enter your email and we’ll send you a reset link
              </p>
            </div>

            {/* Alerts */}
            {message && (
              <div className="alert alert-success text-center small">
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-danger text-center small">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-4">
              <button
                className="btn btn-link text-decoration-none p-0"
                onClick={() => navigate(-1)}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
