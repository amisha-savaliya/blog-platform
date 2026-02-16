import { useEffect, useState } from "react";

export default function Settings() {
  const token = localStorage.getItem("admintoken");

  const [settings, setSettings] = useState({
    admin_email: "",
    contact: "",
    address: "",
    posts_per_page: "",
    // allow_comments: 1,
  });

  useEffect(() => {
    fetch("http://localhost:5000/settings", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, [token]);

  const updateSettings = async () => {
    const res = await fetch("http://localhost:5000/settings/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(settings),
    });

    const data = await res.json();
    if (!res.ok) return alert("Update failed");

    alert(data.msg);
  };

  return (
    <div className="container py-5 mt-5">
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
          <i className="fa-solid fa-gear fa-lg"></i>
        </div>
        <div>
          <h2 className="fw-bold m-0">Blog Settings</h2>
          <small className="text-muted">
            Control your platform configuration
          </small>
        </div>
      </div>

      {/* SETTINGS CARD */}
      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-4 p-md-5">
          {/* SECTION: GENERAL */}
          <h5 className="fw-semibold mb-3 text-secondary">
            <i className="fa fa-user-shield me-2 text-primary"></i>
            Admin Information
          </h5>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Admin Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="admin@email.com"
                value={settings.admin_email}
                onChange={(e) =>
                  setSettings({ ...settings, admin_email: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Contact Number</label>
              <input
                className="form-control form-control-lg"
                placeholder="+91 XXXXX XXXXX"
                value={settings.contact}
                onChange={(e) =>
                  setSettings({ ...settings, contact: e.target.value })
                }
              />
            </div>
          </div>

          {/* SECTION: ADDRESS */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="fa fa-location-dot me-2 text-primary"></i>
              Address
            </label>
            <textarea
              className="form-control form-control-lg"
              rows="2"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
            />
          </div>

          {/* SECTION: BLOG CONTROL */}
          <h5 className="fw-semibold mb-3 text-secondary">
            <i className="fa fa-sliders me-2 text-primary"></i>
            Blog Controls
          </h5>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Posts Per Page</label>
              <input
                type="number"
                className="form-control form-control-lg"
                value={settings.posts_per_page}
                onChange={(e) =>
                  setSettings({ ...settings, posts_per_page: e.target.value })
                }
              />
              <small className="text-muted">
                Controls pagination on blog listing
              </small>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="text-end mt-4">
            <button
              className="btn btn-primary btn-lg px-5 fw-semibold shadow-sm"
              onClick={updateSettings}
            >
              <i className="fa fa-save me-2"></i>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
