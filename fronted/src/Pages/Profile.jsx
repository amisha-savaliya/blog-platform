import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Addpost from "./Addpost";
import { useAuth } from "../context/Authcontext";
import CommentsModal from "../components/CommentModel";
import { useCallback } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const impersonationToken = sessionStorage.getItem("impersonationToken");
  const normalToken = localStorage.getItem("token");
  const token = impersonationToken || normalToken;
  const isImpersonating = sessionStorage.getItem("isImpersonating") === "true";
  const { logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

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
  }, [token, navigate]);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/posts/get", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Load posts failed:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);
  const myPosts = posts.filter((p) => p.user_id === currentUser?.id);

  const formatteddate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const openComments = (postId) => {
    setActivePostId(postId);
    setShowModal(true);
  };

  const closeComments = () => {
    setShowModal(false);
    setActivePostId(null);
  };

  const deletePost = async (slug) => {
    if (!window.confirm("Delete this post?")) return;

    await fetch(`http://localhost:5000/posts/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete post");
        return res.json();
      })
      .then(() => setPosts((prev) => prev.filter((p) => p.slug !== slug)))
      .catch(console.error);
  };

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

  if (!currentUser) return <div className="container mt-5">Loading...</div>;

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

        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          + Add Post
        </button>
      </div>
      {myPosts.length === 0 && (
        <p className="text-muted">You haven't written any posts yet.</p>
      )}

      <div className="row g-3">
        {myPosts.map((p) => {
          return (
            <div className="col-md-4" key={p.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={p.image || "/placeholder.jpg"}
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
                  <p>{p.content?.slice(0, 80)}...</p>
                  <div className=" d-flex-md  gap-3sm mt-2 align-items-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/post/${p.slug}`)}
                    >
                      Read More →
                    </button>{" "}

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/edit-post/${p.slug}`)}
                    >
                      <i className="fa fa-pen"></i> Edit
                    </button>
                    {" "}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletePost(p.slug)}
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                  <div className=" card-footer d-flex gap-4 align-items-center mt-3 fs-6">
                    <button
                      className={p.userLiked ? "text-danger" : "text-muted"}
                      onClick={() => handleLike(p.id)}
                    >
                      {p.userLiked ? "❤️ " : "🤍 "} {p.totalLikes ?? 0}
                    </button>
                    <button
                      className="text-muted fs-50"
                      onClick={() => openComments(p.id)}
                    >
                      <i className="fa-regular fa-comment me-1"></i>{" "}
                      {p.commentCount ?? 0}
                    </button>
                    <button
                      className={"text-primary fw-bold me-1"}
                      // onClick={() => handleLike(p.id)}
                    >
                      <i className="fa-solid fa-eye"></i> {p.views ?? 0}
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
      <CommentsModal
        postId={activePostId}
        token={token}
        currentUser={currentUser}
        show={showModal}
        onClose={closeComments}
      />
    </div>
  );
}
