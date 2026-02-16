import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentModal from "./UserCommentModel";

const UserPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userName } = location.state || {};

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Comment modal control
  const [showComments, setShowComments] = useState(false);
  const [postId, setPostId] = useState(null);

  const token = localStorage.getItem("admintoken");

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    if (!userId) {
      navigate(-1);
      return;
    }

    fetch(
      `http://localhost:5000/posts?userId=${userId}&page=${currentPage}&limit=6`,
      { headers: { Authorization: "Bearer " + token } },
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  }, [userId, currentPage, token, navigate]);

  /* ---------------- DELETE POST ---------------- */
  const removePost = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    await fetch(`http://localhost:5000/posts/${slug}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  /* ---------------- LIKE POST ---------------- */
  const handleLike = async (postId) => {
    const res = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();

    setPosts((prev) =>
      prev.map((p) =>
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

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="md:px-8 py-5 mt-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading text-primary">
          Posts By : <b className="text-capitalize">{userName}</b>
        </h2>
        <span>Total posts : {posts.length}</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/users")}
        >
          Back
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="row g-4">
          {posts.map((post) => (
            <div className="col-md-4" key={post.id}>
              <div
                className="post-entry bg-white p-2 shadow-sm rounded position-relative"
                style={{ minHeight: "520px" }}
              >
                <img
                  src={post.image}
                  className="img-fluid mb-3 rounded"
                  alt=""
                  style={{ height: "280px", width: "100%", objectFit: "cover" }}
                />
                <span className="badge bg-primary position-absolute top-0 start-0 m-4 px-3 py-2 rounded-pill">
                  {post.category}
                </span>

                <h4 className="fw-semibold text-black">{post.title}</h4>

                <span className="d-block text-primary">
                  By <span className="text-muted">{post.author}</span>
                </span>

                {/* <span className="d-block text-primary">{post.category}</span> */}

                <p className="mt-2 fs-6">{post.content.substring(0, 100)}...</p>

                <div className="d-flex justify-content-between align-items-center mt-2 ">
                  <div className="btn-group btn-group-sm gap-3">
                    {/* <button
                      className="btn btn-light border"
                      onClick={() => navigate(`/admin/post/${post.slug}`)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button> */}

                    <button
                      className="btn btn-light border "
                      onClick={() => navigate(`/admin/edit-post/${post.slug}`)}
                    >
                      <i className="fa-solid fa-pen text-warning"></i>
                    </button>

                    <button
                      className="btn btn-light border"
                      onClick={() => removePost(post.slug)}
                    >
                      <i className="fa-solid fa-trash text-danger"></i>
                    </button>
                  </div>
                  <small className="text-muted ms-auto">
                    {formattedDate(post.created_at)}
                  </small>
                </div>

                <div className="card-footer d-flex gap-3 align-items-center mt-1">
                  <button
                    className={
                      post.userLiked ? "text-danger fs-6" : "text-muted fs-6"
                    }
                    onClick={() => handleLike(post.id)}
                  >
                    {post.userLiked ? "❤️ " : "🤍 "} {post.totalLikes || 0}
                  </button>

                  <button
                    className="btn btn-outline-none fs-6"
                    onClick={() => {
                      setPostId(post.id);
                      setShowComments(true);
                    }}
                  >
                    <i className="fa-regular fa-comment"></i>{" "}
                    {post.commentCount || 0}
                  </button>

                  <button
                    className="btn btn-outline-none fs-6"
                    onClick={() => navigate(`/admin/post/${post.slug}`)}
                  >
                    <i className="fa fa-eye"></i> {post.views || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
        <button
          className="btn btn-sm btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-sm btn-outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>

      {/* ✅ SMART COMMENT MODAL */}
      <CommentModal
        show={showComments}
        onClose={() => setShowComments(false)}
        postId={postId}
      />
    </div>
  );
};

export default UserPost;
