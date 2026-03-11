import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  /* 🔍 VERIFY TOKEN */
  useEffect(() => {
    if (!resetToken) {
      setError("Invalid or expired reset link");
      setShowPopup(true);
      setCheckingToken(false);
      return;
    }

    fetch(`http://localhost:5000/blog/auth/verify-reset-token/${resetToken}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      })
      .catch((err) => {
        setError(err.message || "Invalid or expired reset link");
        setShowPopup(true);
      })
      .finally(() => setCheckingToken(false));
  }, [resetToken]);

  /* 🔁 RESET PASSWORD */
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setMessage("");

  try {
    const res = await fetch(
      `http://localhost:5000/auth/reset-password/${resetToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // ✅ Show success message
    setMessage("✅ Password updated successfully! Redirecting to login...");

    // ✅ Delay redirect
    setTimeout(() => {
      navigate("/login");
    }, 2500);
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  /* ⏳ LOADING */
  if (checkingToken) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p className="text-muted">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  /* ❌ INVALID LINK */
  if (showPopup) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow border-0 rounded-4 p-4 text-center">
          <h4 className="text-danger fw-bold mb-5">Link Error</h4>
          <p className="text-muted mb-3">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/forgot-password")}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }
  {message && (
  <div className="alert alert-success text-center">
    {message}
  </div>
)}

{error && (
  <div className="alert alert-danger text-center">
    {error}
  </div>
)}


  /* ✅ VALID LINK → FORM */
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4">
        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-4 p-md-5">

            <div className="text-center mb-4">
              <h3 className="fw-bold">Set New Password</h3>
              <p className="text-muted small mb-0">
                Choose a strong password to secure your account
              </p>
            </div>

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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
