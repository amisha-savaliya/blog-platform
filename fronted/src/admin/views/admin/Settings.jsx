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
    <div className="container mt-5 py-5">
      <h3 className="heading text-primary fw-bold">Blog Settings</h3>

      <div className="card p-4 shadow-sm mt-4">
        <label>Admin Email</label>
        <input
          className="form-control mb-3"
          value={settings.admin_email}
          onChange={(e) =>
            setSettings({ ...settings, admin_email: e.target.value })
          }
        />

        <label>contact</label>
        <input
          className="form-control mb-3"
          value={settings.contact}
          onChange={(e) =>
            setSettings({ ...settings, contact: e.target.value })
          }
        />

        <label>address</label>
        <input
          className="form-control mb-3"
          value={settings.address}
          onChange={(e) =>
            setSettings({ ...settings, address: e.target.value })
          }
        />

        <label>Posts Per Page</label>
        <input
          type="number"
          className="form-control mb-3"
          value={settings.posts_per_page}
          onChange={(e) =>
            setSettings({ ...settings, posts_per_page: e.target.value })
          }
        />

        <button className="btn btn-primary" onClick={updateSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
