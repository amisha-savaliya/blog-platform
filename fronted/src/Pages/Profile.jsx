import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Addpost from "./Addpost";
import { useAuth } from "../context/Authcontext";

export default function Profile() {
  const navigate = useNavigate();
  const impersonationToken = sessionStorage.getItem("impersonationToken");
  const normalToken = localStorage.getItem("token");

  const token = impersonationToken || normalToken;
  const isImpersonating = sessionStorage.getItem("isImpersonating") === "true";

  const { logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/users/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        
        setCurrentUser(data.user);

        if (data.impersonating) {
          console.log("Admin is impersonating");
        }
      })
      .catch(() => navigate("/login"));
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const openComments = (postId) => {
    setActivePostId(postId);
    setShowModal(true);
  };

  const closeComments = () => {
    setShowModal(false);
    setActivePostId(null);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadData();
  }, [token]);

  const loadComments = async () => {
    try {
      const res = await fetch("http://localhost:5000/comment", {
        headers: { Authorization: "Bearer " + token },
      });

      const commentData = await res.json();

      const grouped = {};
      commentData.forEach((c) => {
        if (!grouped[c.post_id]) grouped[c.post_id] = [];
        grouped[c.post_id].push(c);
      });

      setComments(grouped);
    } catch (err) {
      console.error("Load comments failed:", err);
    }
  };
  const loadData = async () => {
    try {
      const postRes = await fetch("http://localhost:5000/posts/get", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      const postData = await postRes.json();
      setPosts(postData);

      await loadComments();
    } catch (err) {
      console.error("Load data failed:", err);
    }
  };

  const addComment = async (postId) => {
    const text = commentText[postId];
    if (!text) return;

    const res = await fetch("http://localhost:5000/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ post_id: postId, comment: text }),
    });

    await res.json();
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    loadComments();
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    await fetch(`http://localhost:5000/comment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    loadComments();
  };

  const editComment = async () => {
    await fetch(`http://localhost:5000/comment/${editCommentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ comment: editText }),
    });

    setEditCommentId(null);
    setEditText("");

    // setShowEditModal(false);
    loadComments();
  };

  const deletePost = async (slug) => {
    if (!window.confirm("Delete this post?")) return;

    await fetch(`http://localhost:5000/posts/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then(() => setPosts((prev) => prev.filter((p) => p.slug !== slug)))
      .catch(console.error);
  };

  if (!currentUser) return <div className="container mt-5">Loading...</div>;

  const myPosts = posts.filter((p) => p.user_id === currentUser.id);

  const formatteddate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const handleLike = async (postId) => {
    const res = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              userLiked: data.liked ? 1 : 0,
              totalLikes: data.liked ? p.totalLikes + 1 : p.totalLikes - 1,
            }
          : p,
      ),
    );
  };

  return (
    <div className="container mt-5">
      {isImpersonating && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>⚠ Admin is impersonating this user account</div>
          <button
            className="btn btn-sm btn-light"
            onClick={() => {
              sessionStorage.removeItem("impersonationToken");
              sessionStorage.removeItem("impersonate_user");

              navigate("/admin/users");
              window.close();
            }}
          >
            End Session
          </button>
        </div>
      )}

      <div className="card shadow p-4 mb-4 h-100">
        <div className="d-flex align-items-center gap-4 mb-1">
          <img
            src="/user.png"
            className="rounded-circle"
            width="100"
            height="100"
            alt="user"
          />
          <div>
            <h3>{currentUser.name}</h3>
            <p className="text-muted fw-semibold mb-1">{currentUser.email}</p>
            <small className="text-muted">
              Joined :{formatteddate(currentUser.created_at)}
            </small>
          </div>
        </div>
        <br />
        <div className="mt-4 d-flex gap-1">
          <p
            className="btn btn-outline-primary fw-semibold"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </p>

          <p
            className="btn btn-outline-danger fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </p>
        </div>
      </div>

      {/* MY POSTS */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Posts</h4>
        {!isImpersonating && (
          <button className="btn btn-success" onClick={() => setShowForm(true)}>
            + Add Post
          </button>
        )}
      </div>
      {myPosts.length === 0 && (
        <p className="text-muted">You haven't written any posts yet.</p>
      )}

      <div className="row g-4">
        {myPosts.map((p) => {
          const postComments = comments[p.id] || [];

          return (
            <div className="col-md-4" key={p.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={p.image}
                  className="card-img-top"
                  style={{ height: "250px" }}
                />
                <div className="card-body">
                  <h5>{p.title}</h5>
                  <span className="date text-muted">
                    {formatteddate(p.created_at)}
                    <br />
                    <a href="#">{p.category}</a> • By - {p.author} <br />
                  </span>
                  <p>{p.content.slice(0, 80)}...</p>
                  <div className=" d-flex gap-1 align-items-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/post/${p.slug}`)}
                    >
                     Read More →
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/edit-post/${p.slug}`)}
                    >
                      <i className="fa fa-pen"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletePost(p.slug)}
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  
                  </div>
                   <div className=" card-footer d-flex gap-4 align-items-center mt-2">
                  <button className={p.userLiked? "text-danger":"text-muted"} onClick={() => handleLike(p.id)}>
                  {p.userLiked ? "❤️ " : "🤍 "} {p.totalLikes || 0}
                </button>
          
                    <button
                      className="text-muted fs-50"
                      onClick={() => openComments(p.id)}
                    >
                      <i className="fa-regular fa-comment me-1"></i>{" "}
                      {(postComments.length)}
                    </button>
                       <button
                      className={"text-primary fw-bold me-1"} 
                      onClick={() => handleLike(p.id)}
                    >
                      <i className="fa-solid fa-eye"></i>  {p.views || 0}
                    </button>{" "}

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <Addpost
          onAdd={(newPost) => setPosts([newPost, ...posts])}
          onClose={() => setShowForm(false)}
        />
      )}

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">All Comments</h5>
                <button className="btn-close" onClick={closeComments}></button>
              </div>

              <div className="modal-body">
                {(comments[activePostId] || []).length === 0 ? (
                  <p>No comments</p>
                ) : (
                  comments[activePostId].map((c) => (
                    <div key={c.id} className="border-bottom py-2">
                      <div className="d-flex justify-content-between">
                        <b>{c.user_name}</b>
                        <small className="text-muted">
                          {formatteddate(c.created_at)}
                        </small>
                      </div>

                      {editCommentId === c.id ? (
                        <div className="mt-2">
                          <textarea
                            className="form-control"
                            rows={1}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />

                          <div className="d-flex gap-2 mt-2 justify-content-end">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={editComment}
                            >
                              Save
                            </button>

                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditCommentId(null);
                                setEditText("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className=" d-flex mt-1 justify-content-between">
                          <p className="mb-1">{c.comment}</p>
                          {currentUser && c.user_id === currentUser.id && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-link p-0 text-primary"
                                onClick={() => {
                                  setEditCommentId(c.id);
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

              <div className="modal-footer d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Write a comment..."
                  value={commentText[activePostId] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [activePostId]: e.target.value,
                    }))
                  }
                />
                <button
                  className="btn btn-primary"
                  onClick={() => addComment(activePostId)}
                >
                  Send
                </button>

                <button className="btn btn-secondary" onClick={closeComments}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
