export default function EditForm({
  form,
  onChange,
  onSubmit,
  loading,
  title,
  subtitle,
  showPasswordNote = true,
}) {
  return (
    <div className="card border-0 shadow-lg rounded-4">
      <div className="card-body p-5">

        {/* HEADER */}
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary bg-opacity-10 mx-auto d-flex align-items-center justify-content-center"
            style={{ width: 70, height: 70 }}
          >
            <i className="fa fa-user-gear text-primary fs-3"></i>
          </div>
          <h3 className="fw-bold mt-3 mb-1">{title}</h3>
          <p className="text-muted small">{subtitle}</p>
        </div>

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            className="form-control form-control-lg"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter full name"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            className="form-control form-control-lg bg-light"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Enter new password"
          />
          {showPasswordNote && (
            <small className="text-muted">
              Leave blank to keep existing password.
            </small>
          )}
        </div>

        {/* ACTION */}
        <div className="text-end">
          <button
            className="btn btn-primary px-5 fw-semibold"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
