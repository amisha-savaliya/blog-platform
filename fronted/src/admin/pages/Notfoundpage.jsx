import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: "85vh",
        background: "linear-gradient(135deg, #eef2ff, #ffffff)",
        padding: "20px",
      }}
    >
      {/* Big 404 */}
      <h1
        style={{
          fontSize: "clamp(90px, 15vw, 160px)",
          fontWeight: "900",
          color: "#0d6efd",
          lineHeight: "1",
          marginBottom: "10px",
        }}
      >
        404
      </h1>

      {/* Title */}
      <h2 className="fw-bold mb-2">Oops! Page not found</h2>

      {/* Description */}
      <p className="text-muted mb-4" style={{ maxWidth: "480px" }}>
        The page you’re trying to access doesn’t exist, may have been moved,
        or you don’t have permission to view it.
      </p>

      {/* Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-3">
        <button
          className="btn btn-primary px-4 shadow-sm"
          onClick={() => navigate("/admin")}
        >
          🏠 Go to Dashboard
        </button>

        <button
          className="btn btn-outline-dark px-4"
          onClick={() => navigate(-1)}
        >
          ⬅ Go Back
        </button>
      </div>

      {/* Footer */}
      <div className="mt-5 text-muted small opacity-75">
        Error Code: 404 • Blog Admin Panel
      </div>
    </div>
  );
}
