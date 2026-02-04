import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("admintoken");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admintoken");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/admin/login");
    fetchUsers();
  }, [token]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) fetchUsers();
  };

  const blockUser = async (id) => {
    await fetch(`http://localhost:5000/users/block/${id}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });
    fetchUsers();
  };

  const unblockUser = async (id) => {
    await fetch(`http://localhost:5000/users/unblock/${id}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });
    fetchUsers();
  };

  const loginAsUser = async (id) => {
    const res = await fetch(`http://localhost:5000/impersonate/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    sessionStorage.setItem("impersonationToken", data.token);
    sessionStorage.setItem("isImpersonating", "true");
    localStorage.setItem("impersonate_user", JSON.stringify(data.user));
    window.open("/profile", "_blank");
  };

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-24 mt-4">

 {/* HEADER */}
<div className="bg-white p-4 shadow-sm rounded mb-4 d-flex justify-content-between align-items-center flex-wrap">

  {/* LEFT SIDE */}
  <h4 className="fw-bold m-0 text-primary-emphasis">
    👥 Users Management
  </h4>

  {/* RIGHT SIDE */}
  <div className="d-flex align-items-center gap-3">

    <input
      type="text"
      className="form-control"
      placeholder="🔍 Search by name or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ width: "250px" }}
    />

    <button
      className="btn btn-primary px-4"
      onClick={() => navigate("/admin/adduser")}
    >
      + Add User
    </button>

  </div>
</div>

   

      {/* TABLE */}
      <div className="bg-white shadow-sm rounded overflow-hidden">
        <table className="table align-middle table-hover m-0">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className={u.is_blocked ? "table-danger" : ""}>

                  {/* USER */}
                  <td className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 38, height: 38 }}
                    >
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-semibold">{u.name}</div>
                      <small className="text-muted">ID: {u.id}</small>
                    </div>
                  </td>

                  <td>{u.email}</td>
                  <td>{formattedDate(u.created_at)}</td>
                  <td>Role {u.role_id}</td>

                  {/* STATUS */}
                  <td>
                    {u.is_blocked ? (
                      <span className="badge bg-danger-subtle text-danger px-3 py-2">
                        🔒 Blocked
                      </span>
                    ) : (
                      <span className="badge bg-success-subtle text-success px-3 py-2">
                        🟢 Active
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="text-end text-nowrap">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      title="View Posts"
                      onClick={() =>
                        navigate("/admin/user-posts", {
                          state: { userId: u.id, userName: u.name },
                        })
                      }
                    >
                      <i className="fa fa-eye"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      title="Edit User"
                      onClick={() =>
                        navigate("/admin/user-edit", {
                          state: {
                            userId: u.id,
                            userName: u.name,
                            email: u.email,
                          },
                        })
                      }
                    >
                      <i className="fa fa-pen"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger me-1"
                      title="Delete"
                      onClick={() => deleteUser(u.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>

                    {u.is_blocked ? (
                      <button
                        className="btn btn-sm btn-outline-success me-1"
                        title="Unblock"
                        onClick={() => unblockUser(u.id)}
                      >
                        <i className="fa fa-lock-open"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-warning me-1"
                        title="Block"
                        onClick={() => blockUser(u.id)}
                      >
                        <i className="fa fa-ban"></i>
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-outline-dark"
                      title="Login as user"
                      onClick={() => loginAsUser(u.id)}
                    >
                    <i className="fa-regular fa-address-card"></i>
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
