import React, { useState } from "react";

export default function CommentModal({
  show,
  onClose,
  comments = [],
  onAdd,
  onDelete,
  onEdit,
  currentUserId,
}) {
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  if (!show) return null;

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };
  // console.log(currentUserId)

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
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Comments ({comments.length})</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div
              className="modal-body"
              style={{ maxHeight: 400, overflowY: "auto" }}
            >
              {comments.length === 0 && (
                <p className="text-muted text-center">No comments yet</p>
              )}

              {comments.map((c) => (
                <div key={c.id} className="border rounded p-2 mb-2">

                  {/* USER + DATE */}
                  <div className="d-flex justify-content-between">
                    <strong>{c.user_name}</strong>
                    <small className="text-muted">
                      {formattedDate(c.created_at)}
                      {c.updated_at && (
                        <span className="text-warning ms-1">(edited)</span>
                      )}
                    </small>
                  </div>

                  {/* COMMENT + ACTIONS ROW */}
                  <div className="d-flex justify-content-between align-items-start gap-2 mt-1">

                    {/* LEFT: TEXT OR EDIT INPUT */}
                    <div className="flex-grow-1">
                      {editId === c.id ? (
                        <input
                          className="form-control form-control-sm"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <p
                          className="mb-0"
                          style={{ maxHeight: "120px", overflowY: "auto" }}
                        >
                          {c.comment}
                        </p>
                      )}
                    </div>

                    {/* RIGHT: ACTION BUTTONS */}
                    <div className="d-flex gap-2 flex-shrink-0">
                      {editId === c.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              onEdit(c.id, editText);
                              setEditId(null);
                              setEditText("");
                            }}
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
                            className="btn btn-link text-primary p-0"
                            onClick={() => {
                              setEditId(c.id);
                              setEditText(c.comment);
                            }}
                          >
                            <i className="fa fa-pen"></i>
                          </button>

                          <button
                            className="btn btn-link text-danger p-0"
                            onClick={() => onDelete(c.id)}
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
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAdd}>
                Send
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop show" onClick={onClose}></div>
    </>
  );
}
