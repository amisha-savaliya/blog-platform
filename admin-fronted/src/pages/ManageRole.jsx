import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRole, deleteRole, fetchRoles, updateRole } from "../Redux/features/roles/roleSlice";

export default function ManageRole() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editName, setEditName] = useState("");
  const token = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const { roles } = useSelector((s) => s.roles);

  useEffect(() => {
    if(!token) return ;
    dispatch(fetchRoles());
  }, [dispatch,token]);

  const handleAddRole = () => {
    if (!name.trim()) return;
    dispatch(addRole({ name })).unwrap();

    setName("");
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete ?")) return null;
    dispatch(deleteRole(id));
  };
  const openEdit = (role) => {
    setEditRoleId(role.id);
    setEditName(role.name);
    setShowEdit(true);
  };

  const editRole = () => {
    if (!editName.trim()) return alert("Role name is required");
    dispatch(updateRole({editRoleId,editName}))

      setShowEdit(false);
  
  };

  return (
    <div className="md:px-10 py-6 space-y-6 mt-3">
      <div className="p-4 shadow-sm rounded-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h2 className="fw-bold text-dark m-0 d-flex align-items-center gap-2 text-primary-emphasis fs-2">
          <i className="fa-solid fa-user-shield "></i>
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
              onClick={handleAddRole}
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
            {roles.map((role,i) => (
              <tr key={role.id}>
                <td className="fw-semibold text-muted">{i+1}</td>
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
                    onClick={() => handleDelete(role.id)}
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
