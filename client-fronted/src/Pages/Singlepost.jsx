import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function SinglePost() {
  const { slug } = useParams();
  const { categories } = useSelector((s) => s.category);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const viewAddedRef = useRef(false);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState({
    name: "",
    email: "",
    message: "",
  });

  const token =
    sessionStorage.getItem("impersonationToken") ||
    localStorage.getItem("token");

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const options = token
      ? { headers: { Authorization: "Bearer " + token } }
      : {};

    fetch(`http://localhost:5000/blog/posts/slug/${slug}`, options)
      .then((res) => res.json())
      .then((data) => {
        (setPost(data), setLoading(false));
      })
      .catch(console.error);
  }, [slug, token]);

  /* ================= ADD VIEW COUNT ================= */
  useEffect(() => {
    if (!post?.id || viewAddedRef.current) return;

    viewAddedRef.current = true;

    fetch(`http://localhost:5000/blog/posts/${post.id}/view`, {
      method: "POST",
      headers: token ? { Authorization: "Bearer " + token } : {},
    })
      .then(() => {
        setPost((prev) => ({
          ...prev,
          views: (prev.views || 0) + 1,
        }));
      })

      .catch(() => {});
  }, [post?.id, slug, token]);

  useEffect(() => {
    viewAddedRef.current = false;
  }, [slug]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!post?.id) {
    return <div>Post not found</div>;
  }

  /* ================= HELPERS ================= */
  const formattedDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleChange = (e) =>
    setComments({ ...comments, [e.target.name]: e.target.value });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");

    fetch("http://localhost:5000/blog/comments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        post_id: post.id,
        comment: comments.message,
      }),
    })
      .then(() => {
        alert("Comment submitted successfully!");
        setComments({ name: "", email: "", message: "" });
      })
      .catch(() => alert("Failed to submit comment"));
  };

  /* ================= NOT FOUND ================= */
  if (!post?.id) {
    return (
      <div className="text-center py-5">
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <>
      {/* ================= HERO ================= */}
      <div
        className="position-relative d-flex align-items-center justify-content-center text-white"
        style={{
          backgroundImage: `url(${post.image || "/images/hero_5.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "450px",
        }}
      >
        {/* Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.65)" }}
        />

        {/* Content */}
        <div className="position-relative text-center px-3">
          <h1 className="fw-bold display-5 mb-3">{post.title}</h1>

          <div className="text-light small">
            <span>{formattedDate(post.created_at)}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.category}</span>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <section className="py-5">
        <div className="container">
          <button
            className="btn btn-outline-primary mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back to Blog
          </button>

          <div className="row">
            {/* MAIN CONTENT */}
            <div className="col-lg-9 mx-auto">
              <article className="bg-white">
                <div
                  className="fs-5 text-dark"
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.9",
                    fontSize: "1.1rem",
                  }}
                >
                  {post.content}
                </div>

                {post.image && (
                  <div className="my-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="img-fluid w-100 rounded shadow-sm"
                      style={{
                        maxHeight: "480px",
                        //  objectFit: "cover"
                      }}
                    />
                  </div>
                )}

                <div className="d-flex gap-3 mt-3">
                  <span className="badge bg-secondary">
                    {post.views || 0} Views
                  </span>
                  <span className="badge bg-light text-dark">
                    {post.commentCount || 0} Comments
                  </span>
                </div>
              </article>

              {/* COMMENT FORM */}
              <div className="card shadow-sm border-0 mt-5">
                <div className="card-body">
                  <h4 className="mb-3">Leave a Comment</h4>
                  <form onSubmit={handleCommentSubmit}>
                    <input
                      className="form-control mb-3"
                      name="name"
                      placeholder="Your Name"
                      value={comments.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      className="form-control mb-3"
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={comments.email}
                      onChange={handleChange}
                      required
                    />
                    <textarea
                      className="form-control mb-3"
                      rows="5"
                      name="message"
                      placeholder="Write your comment..."
                      value={comments.message}
                      onChange={handleChange}
                      required
                    />
                    <button className="btn btn-primary">Post Comment</button>
                  </form>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="col-lg-3 px-3">
              <div className="position-sticky" style={{ top: "90px" }}>
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Categories</h5>
                    <ul className="list-unstyled">
                      {categories.map((cat) => (
                        <li key={cat.id} className="mb-2">
                          <Link
                            to={`/category/${cat.name}`}
                            className="text-decoration-none d-flex justify-content-between"
                          >
                            <span>{cat.name}</span>
                            <span className="text-muted">
                              ({cat.posts || 0})
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card shadow-sm">
                  <div className="card-body">
                    <h4 className="fw-bold mb-4 border-bottom pb-2">Tags</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {categories.map((tag, i) => (
                        <Link
                          key={i}
                          to={`/category/${tag.name}`}
                          className="badge bg-light text-dark text-decoration-none "
                        >
                          #{tag.name.toLowerCase()}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END SIDEBAR */}
          </div>
        </div>
      </section>
    </>
  );
}
