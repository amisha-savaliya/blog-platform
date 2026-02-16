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

  // 🔍 VERIFY TOKEN ON PAGE LOAD
  useEffect(() => {
    if (!resetToken) {
      setError("Invalid reset link");
      setShowPopup(true);
      setCheckingToken(false);
      return;
    }

    fetch(`http://localhost:5000/auth/verify-reset-token/${resetToken}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      })
      .catch((err) => {
        setError(err.message || "Invalid or expired link");
        setShowPopup(true);
      })
      .finally(() => setCheckingToken(false));
  }, [resetToken]);

  // 🔁 RESET PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

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

      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Reset failed");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // LOADING STATE WHILE VERIFYING TOKEN
  if (checkingToken) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <h5>Checking reset link...</h5>
      </div>
    );
  }

  //  INVALID / USED / EXPIRED LINK POPUP PAGE
  if (showPopup) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card p-4 shadow rounded-4 text-center">
          <h4 className="text-danger mb-3">{error}</h4>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/forgot-password")}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  // VALID LINK → SHOW RESET FORM
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">

            <div className="text-center mb-4">
              <h3 className="fw-bold">New Password</h3>
              <p className="text-muted mb-0">Enter your new password below</p>
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
