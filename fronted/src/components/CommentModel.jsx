import { useState, useEffect } from "react";

export default function CommentsModal({
  postId,
  token,
  currentUser,
  show,
  onClose,
}) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  useEffect(() => {
    if (show && postId) loadComments();
  }, [postId, show]);

  const loadComments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/comment?post_id=${postId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Load comments failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/comment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ post_id: postId, comment: text }),
      });

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]); // instant UI update
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    await fetch(`http://localhost:5000/comment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    await fetch(`http://localhost:5000/comment/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ comment: editText }),
    });

    setComments((prev) =>
      prev.map((c) => (c.id === editId ? { ...c, comment: editText } : c)),
    );

    setEditId(null);
    setEditText("");
  };

  const closeModal = () => {
    setEditId(null);
    setEditText("");
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header">
            <h5 className="fw-bold">Comments ({comments.length})</h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-muted">No comments yet</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border-bottom py-3">
                  <div className="d-flex justify-content-between">
                    <b>{c.user_name}</b>
                    <small className="text-muted">
                      {formattedDate(c.created_at)}
                    </small>
                  </div>

                  {editId === c.id ? (
                    <>
                      <textarea
                        className="form-control mt-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="mt-2 text-end">
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditId(null);
                            setEditText("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between mt-2">
                      <p className="mb-0">{c.comment}</p>
                      {currentUser?.id === c.user_id && (
                        <div>
                          <button
                            className="btn btn-link p-0 me-2"
                            onClick={() => {
                              setEditId(c.id);
                              setEditText(c.comment);
                            }}
                          >
                            <i className="fa fa-pen"></i>
                          </button>
                          <button
                            className="btn btn-link p-0 text-danger"
                            onClick={() => deleteComment(c.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="modal-footer">
            <input
              className="form-control"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addComment}>
              Send
            </button>
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
