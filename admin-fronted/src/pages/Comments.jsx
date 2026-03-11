import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector} from "react-redux"
import { deleteComment, fetchAllComments, updateComment } from "../Redux/features/comments/commentSlice";

export default function Comments() {
  const navigate = useNavigate();
  const { token }=useSelector(s=>s.auth); 
  const dispatch=useDispatch();

  const { comments }=useSelector(s=>s.comments)
  const [search, setSearch] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editId,setEditId]=useState(null);

useEffect(() => {
  if (!token) {
    navigate("/login");
  } else {
    dispatch(fetchAllComments());
  }
}, [token, dispatch, navigate]);

  const filteredComments = useMemo(() => {
    const s = search.toLowerCase();
    return comments.filter(
      (c) =>
        c.comment?.toLowerCase().includes(s) ||
        c.user_name?.toLowerCase().includes(s),
    );
  }, [comments, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

  
    dispatch(deleteComment({commentId:id}));
  };




const handleSaveEdit = (id) => {
  if (!editText.trim()) return;

  dispatch(
    updateComment({
      commentId: id,
      postId: editId,
      content: editText,
    })
  );

  setEditText("");
  setEditId(null);
  setEditingComment(null);   // ✅ close modal
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
        <h2 className="fw-bold text-primary-emphasis m-0 fs-2">💬 Comment Moderation</h2>

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
                            setEditId(c.post_id);
                          }}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c.id)}
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
                onClick={ ()=> handleSaveEdit(editingComment.id)}
                
            
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
