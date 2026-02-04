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

  const formatteddate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    if (show && postId) loadComments();
  }, [postId, show]);


const loadComments = async () => {
  try {
    const res = await fetch("http://localhost:5000/comment", {
      headers: { Authorization: "Bearer " + token },
    });

    const commentData = await res.json();

    // Only comments of this post
    const postComments = commentData.filter((c) => c.post_id === postId);

    setComments(postComments); 
  } catch (err) {
    console.error("Load comments failed:", err);
  }
};

  const addComment = async () => {
    if (!text) return;
    await fetch("http://localhost:5000/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ post_id: postId, comment: text }),
    });
    setText("");
    loadComments();
  };

  const deleteComment = async (id) => {
    if(!window.confirm("Delete this comment?")) return;
    await fetch(`http://localhost:5000/comment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    loadComments();
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:5000/comment/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ comment: editText }),
    });
    setEditId(null);
    setEditText("");
    loadComments();
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>All Comments ({comments.length})</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {comments.length === 0 ? (
              <p>No comments</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border-bottom py-2">
                  <div className="d-flex justify-content-between">
                    <b>{c.user_name}</b>
                    <small>{formatteddate(c.created_at)}</small>
                  </div>

                  {editId === c.id ? (
                    <>
                      <textarea
                        className="form-control mt-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="mt-2 text-end">
                        <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between mt-1">
                      <p>{c.comment}</p>
                      {currentUser?.id === c.user_id && (
                        <div>
                          <button className="btn btn-link p-0 me-2" onClick={() => {
                            setEditId(c.id);
                            setEditText(c.comment);
                          }}><i className="fa fa-pen"></i></button>
                          <button className="btn btn-link p-0 text-danger" onClick={() => deleteComment(c.id)}><i className="fa fa-trash"></i></button>
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
              placeholder="Write comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addComment}>Send</button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
