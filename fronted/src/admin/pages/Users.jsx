import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewPost from "./Viewpost";

export default function Users({ users }) {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const token = localStorage.getItem("admintoken");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    setUsersList((prev) => prev.filter((u) => u.id !== id));
    alert("User deleted");
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
  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const loginAsUSer = async (id) => {
    const res = await fetch(`http://localhost:5000/impersonate/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    // console.log(id);

    sessionStorage.setItem("impersonationToken", data.token);
    sessionStorage.setItem("isImpersonating", "true");
    localStorage.setItem("impersonate_user", JSON.stringify(data.user));
    // console.log(data.user);

    window.open("/profile", "_blank");
    // window.location.href = "/profile";

  };

  return (
    <div className="container section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading text-primary">Total Users</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/adduser")}
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          {/* <thead className="bg-blueGray-100"> */}
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Joining at</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {usersList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              usersList.map((u) => (
                <tr key={u.id} className={u.is_blocked ? "opacity-50" : ""}>
                  <td className="border px-4 py-2">{u.id}</td>
                  <td className="border px-4 py-2">{u.name}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">
                    {formattedDate(u.created_at)}
                  </td>
                  <td className="border px-4 py-2">{u.role_id}</td>
                  <td className="border px-4 py-2">
                    {u.is_blocked ? "Blocked" : "Active"}
                  </td>
                  <td className="border px-4 py-2 gap-3">
                    <button
                      className="btn btn-info me-2"
                      onClick={() =>
                        navigate("/admin/user-posts", {
                          state: { userId: u.id, userName: u.name },
                        })
                      }
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-primary me-2"
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
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => deleteUser(u.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>

                    {u.is_blocked ? (
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => unblockUser(u.id)}
                      >
                        <i className="fa-solid fa-lock-open"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => blockUser(u.id)}
                      >
                        <i className="fa-solid fa-ban"></i>
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => loginAsUSer(u.id)}
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
