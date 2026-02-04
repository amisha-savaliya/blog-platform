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
    <div className="container py-5 mt-24">
      <div className="d-flex justify-content-between text-primary fw-semibold align-items-center mb-4">
        <h3 className="heading text-primary fw-bold">Manage Roles</h3>
        <button className="btn btn-primary " onClick={() => setShowForm(true)}>
          + Add Role
        </button>
      </div>

      {showForm && (
        <div className="card p-3 mb-4">
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-success" onClick={addRole}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-blueGray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Role Name</th>
              

              <th className="px-4 py-2 border"> Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="border px-4 py-2 font-medium">{role.id}</td>
                <td className="border px-4 py-2 font-medium">{role.name}</td>
                
                <td className="border px-4 py-2 font-medium">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(role)}

                  >
                    {/* <i className="fa fa-pen"></i> */}
                    ✏️ Edit
                  </button>
                  {"  "}
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => deleteRole(role.id)}
                  >
                    <i className="fa fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}

            {roles.length === 0 && (
              <tr>
                <td colSpan="3" className="text-muted py-4">
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>





       {/* EDIT MODAL */}
      {showEdit && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5>Edit Role</h5>

              <input
                className="form-control my-3"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <div className="text-end">
                <button className="btn btn-secondary me-2" onClick={() => setShowEdit(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={editRole}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
