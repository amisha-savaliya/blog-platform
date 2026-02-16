import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Comments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admintoken");

  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:5000/comment", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401) {
        localStorage.removeItem("admintoken");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/admin/login");
    else fetchComments();
  }, []);

  const filteredComments = useMemo(() => {
    const s = search.toLowerCase();
    return comments.filter(
      (c) =>
        c.comment?.toLowerCase().includes(s) ||
        c.user_name?.toLowerCase().includes(s),
    );
  }, [comments, search]);

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    await fetch(`http://localhost:5000/comment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchComments();
  };

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="md:px-10 py-4 space-y-6 mt-2">
      <div
        className="  p-4 shadow-sm rounded d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
        style={{ position: "relative", zIndex: 5 }}
      >
        <h2 className="fw-bold text-primary m-0">💬 Comment Moderation</h2>

        <div style={{ width: "260px" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search comments..."
            className="form-control"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light text-muted text-uppercase small">
                <tr>
                <th></th>
                  <th>User</th>
                  <th>Comment</th>
                  <th>Post</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No comments found
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((c) => (
                    <tr key={c.id} className={c.is_delete ? "opacity-50" : ""}>
                    <td></td>
                      <td className="fw-semibold">{c.user_name}</td>

                      <td style={{ maxWidth: "380px" }}>
                        {c.comment.length > 90
                          ? c.comment.slice(0, 90) + "..."
                          : c.comment}
                      </td>

                      <td>Post #{c.post_id}</td>

                      <td className="text-muted">
                        {formattedDate(c.created_at)}
                      </td>

                      <td>
                        {c.is_delete ? (
                          <span className="badge bg-danger">Deleted</span>
                        ) : (
                          <span className="badge bg-success">Active</span>
                        )}
                      </td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => {
                            setEditingComment(c);
                            setEditText(c.comment);
                          }}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteComment(c.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
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

      {editingComment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: editingComment ? "auto" : "none",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              padding: "20px",
            }}
          >
            <h5 className="fw-bold mb-3">Edit Comment</h5>

            <textarea
              className="form-control mb-3"
              rows="4"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setEditingComment(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  await fetch(
                    `http://localhost:5000/comment/${editingComment.id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                      body: JSON.stringify({ comment: editText }),
                    },
                  );
                  setEditingComment(null);
                  fetchComments();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
