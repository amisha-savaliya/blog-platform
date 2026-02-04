import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../context/Categorycontext";

import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import CommentModal from "./CommentModel";

export default function Adminprofile() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const { categories } = useCategories();
  const [user, setUser] = useState(null);
  const [modalComments, setModalComments] = useState([]);

  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const openComments = async (postId) => {
    setSelectedPostId(postId);

    const res = await fetch(`http://localhost:5000/comment?post_id=${postId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    setModalComments(data);
    setShowComments(true);
  };

  const token = localStorage.getItem("admintoken");

  const decodedUser = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  const userId = decodedUser?.id;
  useEffect(() => {
    if (!token || !decodedUser) {
      localStorage.removeItem("admintoken");
      navigate("/admin/login");
    }
  }, [token, decodedUser, navigate]);

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:5000/users?id=${userId}`, {
      headers: { Authorization: "Bearer " + token },
    });
    setUser(await res.json());
  };

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:5000/posts/get", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setPosts(data.posts);
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchUser();
    fetchPosts();
  }, [token, userId]);

  if (!user) {
    return (
      <div className="text-center py-5">
        <h4>Loading profile…</h4>
        <pre>{JSON.stringify({ user, posts }, null, 2)}</pre>
      </div>
    );
  }

  const myPosts = useMemo(
    () => posts.filter((p) => p.user_id === user.id),
    [posts, user.id],
  );

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const deletePost = async (slug) => {
    if (!window.confirm("Delete this post?")) return;

    await fetch(`http://localhost:5000/posts/${slug}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    setPosts((prev) => prev.filter((p) => p.slug !== slug));
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
              totalLikes: data.liked
                ? (p.totalLikes || 0) + 1
                : Math.max(0, (p.totalLikes || 0) - 1),
            }
          : p,
      ),
    );
  };

  const logout = () => {
    fetch("http://localhost:5000/logout", {
      headers: { Authorization: "Bearer " + token },
    }).finally(() => {
      localStorage.removeItem("admintoken");
      navigate("/admin/login", { replace: true });
    });
  };

  const addComment = async (text) => {
    const res = await fetch("http://localhost:5000/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        post_id: selectedPostId,
        comment: text,
      }),
    });

    const newComment = await res.json();

    setModalComments((prev) => [...prev, newComment]);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPostId
          ? { ...p, commentCount: (p.commentCount || 0) + 1 }
          : p,
      ),
    );

    alert("comment Added");
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Are you sure to delete comment ?")) return;
    const res = await fetch(`http://localhost:5000/comment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    await res.json();

    setModalComments((prev) => prev.filter((c) => c.id !== id));
  };

  const editComment = async (id, newText) => {
    await fetch(`http://localhost:5000/comment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ comment: newText }),
    });

    setModalComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, comment: newText } : c)),
    );
  };

  return (
    <div className="container py-4">
      {/* PROFILE */}
      <div className="card shadow p-4 mb-4">
        <div className="d-flex gap-4 align-items-center">
          <img
            src={user.avatar || "/user.png"}
            className="rounded-circle"
            width="100"
            height="100"
          />
          <div>
            <h2>{user.name}</h2>
            <p className="text-muted mb-1">{user.email}</p>
            <small className="text-muted">
              Joined: {formattedDate(user.created_at)}
            </small>
          </div>
        </div>
        <div className="mt-4 d-flex gap-1">
          <button
            className=" btn btn-outline-primary text-primary fw-semibold"
            onClick={() => navigate("/admin/edit-profile")}
            style={{ cursor: "pointer" }}
          >
            ✏️ Edit Profile
          </button>

          <button
            className=" btn btn-outline-danger text-danger outline-danger"
            style={{ cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4 text-center">
        <Stat title="My Posts" value={myPosts.length} />
        <Stat title="Categories" value={categories.length} />
        <Stat title="All Posts" value={posts.length} />
      </div>

      {/* POSTS */}
      <div className="row g-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="heading text-primary">My Posts</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/posts/add")}
          >
            + Add Blog
          </button>
        </div>
        {myPosts.map((p) => {
          return (
            <div className="col-md-4" key={p.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={p.image || "/post.png"}
                  style={{ height: "250px", width: "" }}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5>{p.title}</h5>
                  <small className="text-muted">
                    {formattedDate(p.created_at)} • {p.category}
                  </small>
                  <p className="mt-2">{p.content.slice(0, 80)}...</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => navigate(`/admin/post/${p.slug}`)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/edit-post/${p.slug}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletePost(p.slug)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className=" card-footer d-flex gap-2 align-items-center mt-1 mb-0">
                    <button
                      className={
                        p.userLiked ? "text-danger fs-6" : "text-muted fs-6"
                      }
                      onClick={() => handleLike(p.id)}
                    >
                      {p.userLiked ? "❤️ " : "🤍 "} {p.totalLikes || 0}
                    </button>
                    <button
                      className="btn btn-outline-none fs-6"
                      onClick={() => openComments(p.id)}
                    >
                      <i className="fa-regular fa-comment"></i> {p.commentCount}
                    </button>{" "}
                    <button className="btn btn-outline-none fs-6">
                      <i className="fa fa-eye"></i> {p.views}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <CommentModal
        show={showComments}
        onClose={() => setShowComments(false)}
        comments={modalComments}
        onAdd={addComment}
        onDelete={deleteComment}
        onEdit={editComment}
        postId={selectedPostId}
        currentUserId={user?.id}
      />
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm p-3">
        <h6 className="text-muted">{title}</h6>
        <h3 className="text-primary">{value}</h3>
      </div>
    </div>
  );
}
