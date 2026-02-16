import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../context/Categorycontext";

import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import CommentModal from "./UserCommentModel";

export default function Adminprofile() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const { categories } = useCategories();
  const [user, setUser] = useState(null);

  const [showComments, setShowComments] = useState(false);
  const [postId, setPostId] = useState(null);

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

  return (
    <div className=" md:px-10 py-6 space-y-5 mt-1">
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
            className=" btn btn-outline-primary fw-semibold"
            onClick={() => navigate("/admin/edit-profile")}
            style={{ cursor: "pointer" }}
          >
            ✏️ Edit Profile
          </button>

          <button
            className=" btn btn-outline-danger  outline-danger"
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
          <h2 className="heading text-primary-emphasis fw-semibold">
            My Posts
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/posts/add")}
          >
            + Add Blog
          </button>
        </div>
        {myPosts.map((p) => {
          return (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-4" key={p.id}>
              <div className="card  h-100 shadow-sm">
                <img
                  src={p.image}
                  className="w-100 rounded-top"
                  style={{ height: "280px", objectFit: "cover" }}
                  alt=""
                />

                <span className="badge bg-primary position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill">
                  {p.category}
                </span>
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold mt-3 mb-1 text-break">{p.title}</h5>

                  <div className="text-muted small mb-2">
                    {p.author} • {formattedDate(p.created_at)}
                  </div>

                  <p className="text-muted small mt-2 flex-grow-1">
                    {p.content.slice(0, 120)}...
                  </p>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/edit-post/${p.slug}`)}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletePost(p.slug)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="card-footer bg-white border-0 mt-auto flex justify-between items-center pt-4">
                  <button
                    className={p.userLiked ? "text-danger" : "text-muted"}
                    onClick={() => handleLike(p.id)}
                  >
                    {p.userLiked ? "❤️" : "🤍"} {p.totalLikes || 0}
                  </button>

                  <button
                    className="text-muted"
                    onClick={() => {
                      setPostId(p.id);
                      setShowComments(true);
                    }}
                  >
                    <i className="fa-regular fa-comment"></i> {p.commentCount}
                  </button>

                  <button
                    className="text-muted"
                    onClick={() => navigate(`/admin/post/${p.slug}`)}
                  >
                    <i className="fa fa-eye"></i> {p.views}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CommentModal
        show={showComments}
        onClose={() => setShowComments(false)}
        postId={postId}
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
