import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "../features/comments/commentSlice";
import { selectActiveUser } from "../features/auth/authSlice";

export default function CommentsModal({ postId, show, onClose }) {
  const comments =
    useSelector((state) => state.comments.commentsByPost[postId]) || [];
  const { loading } = useSelector((s) => s.comments);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const user = useSelector(selectActiveUser)
  const dispatch = useDispatch();

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
    if (show && postId) dispatch(fetchComments({ postId }));
  }, [postId, show, dispatch]);

  const handleAddComment = () => {
    if (!text.trim()) return;

    dispatch(addComment({ postId, content: text }));
    setText("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this comment?")) return;

    dispatch(deleteComment({ commentId: id, postId }));
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;

    dispatch(
      updateComment({
        commentId: editId,
        postId,
        content: editText,
      }),
    );

    setEditId(null);
    setEditText("");
  };

  const closeModal = () => {
  setEditId(null);
  setEditText("");
  setText("");
  onClose();
};

  if (!show) return null;

const getDisplayDate = (comment) => {
  if (comment.updated_at) {
    const created = new Date(comment.created_at).getTime();
    const updated = new Date(comment.updated_at).getTime();

    if (!isNaN(updated) && updated > created) {
      return `(Edited)• ${formattedDate(comment.updated_at)}`;
    }
  }

  return formattedDate(comment.created_at);
};

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
                      {getDisplayDate(c)}
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
                          onClick={handleSaveEdit}
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
                      {user?.id === c.user_id && (
                        <div>
                          <button
                            className="btn btn-link p-0 me-2 cursor-pointer"
                            onClick={() => {
                              setEditId(c.id);
                              setEditText(c.comment);
                            }}
                          >
                            <i className="fa fa-pen"></i>
                          </button>
                          <button
                            className="btn btn-link p-0 text-danger"
                            onClick={() => handleDelete(c.id)}
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
            <button className="btn btn-primary" onClick={handleAddComment}>
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
