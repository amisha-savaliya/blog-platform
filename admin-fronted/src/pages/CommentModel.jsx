import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, deleteComment, fetchComments, updateComment } from "../Redux/features/comments/commentSlice";

export default function CommentModal({ show, onClose, postId }) {
  

 const comments = useSelector(
  (state) => state.comments.commentsByPost[postId] || []
);

const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const editInputRef = useRef(null);

 useEffect(() => {
  if (show && postId) {
    dispatch(fetchComments({postId}));
  }
}, [show, postId, dispatch]);


  /* ---------------- AUTO FOCUS EDIT ---------------- */
  useEffect(() => {
    if (editId && editInputRef.current) editInputRef.current.focus();
  }, [editId]);

  /* ---------------- CLOSE ON ESC ---------------- */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!show) return null;

  /* ---------------- ADD COMMENT ---------------- */
const handleAdd = () => {
  if (!text.trim()) return;

  dispatch(addComment({ postId, content: text }));
  setText("");
};

  /* ---------------- EDIT COMMENT ---------------- */
 const handleSaveEdit = (id) => {
  if (!editText.trim()) return;

  dispatch(
    updateComment({
      commentId: id,
      postId,
      content: editText,
    })
  );

  setEditId(null);
  setEditText("");
};

  /* ---------------- DELETE COMMENT ---------------- */
const handleDelete = (id) => {
  dispatch(deleteComment({ commentId: id, postId }));
};

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <div className="modal show d-block">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow">

            {/* HEADER */}
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold">
                💬 Manage Comments ({comments.length})
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body" style={{ maxHeight: 450, overflowY: "auto" }}>
              {comments.length === 0 && (
                <p className="text-muted text-center">No comments found</p>
              )}

              {comments.map((c) => (
                <div key={c.id} className="border rounded p-3 mb-2 bg-white">

                  <div className="d-flex justify-content-between">
                    <strong>{c.user_name}</strong>
                    <small className="text-muted">
                      {formattedDate(c.created_at)}
                      {c.updated_at && (
                        <span className="text-warning ms-1">(edited)</span>
                      )}
                    </small>
                  </div>

                  <div className="d-flex justify-content-between align-items-start gap-2 mt-2">
                    <div className="flex-grow-1">
                      {editId === c.id ? (
                        <input
                          ref={editInputRef}
                          className="form-control form-control-sm"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                      ) : (
                        <p className="mb-0">{c.comment}</p>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      {editId === c.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSaveEdit(c.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm text-primary"
                            onClick={() => {
                              setEditId(c.id);
                              setEditText(c.comment);
                            }}
                          >
                            <i className="fa fa-pen"></i>
                          </button>
                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => handleDelete(c.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="modal-footer d-flex gap-2">
              <input
                className="form-control"
                placeholder="Add admin comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <button className="btn btn-primary" onClick={handleAdd}>
                Add
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop show" onClick={onClose}></div>
    </>
  );
}
