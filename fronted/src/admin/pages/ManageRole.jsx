import React, { useEffect, useState } from "react";

export default function ManageRole() {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editName, setEditName] = useState("");
  const token = localStorage.getItem("admintoken");

  const loadRoles = () => {
    fetch("http://localhost:5000/roles", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const addRole = () => {
    if (!name.trim()) return;

    fetch("http://localhost:5000/roles/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then(() => {
        setName("");
        setShowForm(false);
        loadRoles();
      });
  };

  const deleteRole = (id) => {
    if (!window.confirm("Are you sure to delete ?")) return null;
    fetch(`http://localhost:5000/roles/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    }).then(() => loadRoles());
  };
  const openEdit = (role) => {
    setEditRoleId(role.id);
    setEditName(role.name);
    setShowEdit(true);
  };

  const editRole = () => {
    if (!editName.trim()) return alert("Role name is required");

    fetch(`http://localhost:5000/roles/${editRoleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name: editName }),
    }).then(() => {
      setShowEdit(false);
      loadRoles();
    });
  };

  return (
    <div className="md:px-10 py-6 space-y-6 mt-3">
      <div className="p-4 shadow-sm rounded-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h2 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
          <i className="fa-solid fa-user-shield text-primary"></i>
        Roles & Permissions
        </h2>

        <button
          className="btn btn-primary px-4 fw-semibold"
          onClick={() => setShowForm(true)}
        >
          <i className="fa fa-plus me-2"></i> Add Role
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-body d-flex gap-3 align-items-center flex-wrap">
            <input
              className="form-control form-control-lg"
              placeholder="Enter role name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              className="btn btn-success px-4 fw-semibold"
              onClick={addRole}
            >
              Save
            </button>
            <button
              className="btn btn-light border px-4"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-hover align-middle bg-white shadow-sm rounded-3 overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>Id</th>
              <th>Role Name</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="fw-semibold text-muted">{role.id}</td>
                <td className="fw-semibold">{role.name}</td>

                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2 px-3"
                    onClick={() => openEdit(role)}
                  >
                    <i className="fa fa-pen me-1"></i> Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger px-3"
                    onClick={() => deleteRole(role.id)}
                  >
                    <i className="fa fa-trash me-1"></i> Delete
                  </button>
                </td>
              </tr>
            ))}

            {roles.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-5 text-muted">
                  <i className="fa fa-user-slash fa-2x mb-2 d-block"></i>
                  No roles created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="fa fa-pen-to-square me-2 text-primary"></i>
                  Edit Role
                </h5>
              </div>

              <div className="modal-body">
                <input
                  className="form-control form-control-lg"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-light border px-4"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4 fw-semibold"
                  onClick={editRole}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
