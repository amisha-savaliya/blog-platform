import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  blockUser,
  deleteUser,
  fetchUsers,
  impersonateUser,
  unblockUser,
} from "../Redux/features/users/usersSlice";

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { token } = useSelector((s) => s.auth);
  const { users } = useSelector((s) => s.users);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!token) return navigate("/login");
    dispatch(fetchUsers());
  }, [token, dispatch, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    dispatch(deleteUser(id));
  };

const loginAsUser = async (id) => {
  try {
    const data = await dispatch(impersonateUser(id)).unwrap();

    if (!data?.token) {
      throw new Error("Token not received");
    }

    window.open(
      `http://localhost:5173/impersonate?token=${data.token}`,
      "_blank"
    );
  } catch (err) {
    console.error("Impersonation failed:", err);
  }
};

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="md:px-10 space-y-6 mt-2 py-4 ">
      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm rounded mb-4 d-flex justify-content-between align-items-center flex-wrap">
        {/* LEFT SIDE */}
        <h2 className="fw-bold m-0 text-primary-emphasis fs-2">
          👥 Users Management
        </h2>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "250px", borderRadius: "6px" }}
          />

          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/adduser")}
          >
            + Add User
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-100 overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="bg-white shadow-sm rounded">
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
                    <tr
                      key={u.id}
                      className={u.is_blocked ? "table-danger" : ""}
                    >
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
                      <td> {u.role_id}</td>

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
                            navigate("/user-posts", {
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
                            navigate("/user-edit", {
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
                          onClick={() => handleDelete(u.id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>

                        {u.is_blocked ? (
                          <button
                            className="btn btn-sm btn-outline-success me-1"
                            title="Unblock"
                            onClick={() => dispatch(unblockUser(u.id))}
                          >
                            <i className="fa fa-lock-open"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-warning me-1"
                            title="Block"
                            onClick={() => dispatch(blockUser(u.id))}
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
      </div>
    </div>
  );
}
