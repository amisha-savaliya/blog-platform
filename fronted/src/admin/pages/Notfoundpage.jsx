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
      style={{ height: "50vh", background: "#f8f9fa", padding: "1px" }}
    >
      <h1 style={{ fontSize: "120px", fontWeight: "800", color: "#0d6efd" }}>
        404
      </h1>

      <h3 className="fw-bold mb-2">Oops! Page not found</h3>

      <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <div className="d-flex gap-3">
        <button className="btn btn-primary px-4" onClick={() => navigate("/admin/")}>
          Go Home
        </button>

        <button
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>

      <div className="mt-5 text-muted small">Error Code: 404 | Blog System</div>
    </div>
  );
}
