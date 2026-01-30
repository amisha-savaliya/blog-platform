import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Comments() {
  const token = localStorage.getItem("admintoken");
  const [comment, setComment] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const navigate = useNavigate();

  const fetchComments = async () => {
    const res = await fetch("http://localhost:5000/comment", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setComment(data);
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchComments();
  }, []);

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    await fetch(`http://localhost:5000/comment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    await console.log(fetchComments());
  };

  const approvedComment = async (id) => {
    if (!window.confirm("Approve this comment?")) return;

    await fetch(`http://localhost:5000/comment/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    // fetchComments();
    await fetchComments();
  };
  const formattedDate = date =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  return (
    <div className="container section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading text-primary">Manage Comments</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-blueGray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Comment</th>
              <th className="px-4 py-2 border">user</th>
              <th className="px-4 py-2 border">post_id</th>
              <th className="px-4 py-2 border">created_at</th>
              {/* <th className="px-4 py-2 border">status</th> */}
              {/* <th className="px-4 py-2 border">is_delete</th> */}

              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {comment.map((c, index) => (
              <tr
                key={index}
                className={`${c.is_delete  ? "opacity-50" : ""
                }`}
              >
                <td className="border px-4 py-2">{c.id}</td>
                <td className="border px-4 py-2" style={{width:"400px",overflowY:"auto"}}>{c.comment}</td>
                <td className="border px-4 py-2">{c.user_name}</td>
                <td className="border px-4 py-2">{c.post_id}</td>
                <td className="border px-4 py-2">{formattedDate(c.created_at)}</td>
              
                

                <td className="border px-4 py-2">
              
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setEditingComment(c);
                      setEditText(c.comment);
                    }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => deleteComment(c.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingComment && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Comment</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingComment(null)}
                ></button>
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
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
                      }
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
        </div>
      )}
    </div>
  );
}
