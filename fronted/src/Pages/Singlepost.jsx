import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCategories } from "../context/Categorycontext";
export default function SinglePost() {
  const { slug } = useParams();
  const { categories } = useCategories();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [viewAdded, setViewAdded] = useState(false);
  const [comments, setComments] = useState({
    name: "",
    email: "",
    message: "",
  });

  const impToken = sessionStorage.getItem("impersonateToken");
  const normalToken = localStorage.getItem("token");
  const token = impToken || normalToken;

  // console.log(slug);
  useEffect(() => {
    const options = token
      ? {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      : {};

    fetch(`http://localhost:5000/posts/${slug}`, options)
      .then((res) => res.json())
      .then((data) => setPost(data))

      .catch((err) => console.error("FETCH ERROR:", err));
  }, [slug, token]);

  useEffect(() => {
    if (!post?.id || viewAdded) return;

    const addView = async () => {
      try {
        await fetch(`http://localhost:5000/posts/${post.id}/view`, {
          method: "POST",
          headers: token ? { Authorization: "Bearer " + token } : {},
        });

        // update UI only once
        setPost((prev) => ({
          ...prev,
          views: (prev.views || 0) + 1,
        }));
        setViewAdded(true);
      } catch (err) {
        console.log("View not recorded (guest or error)", err);
      }
    };

    addView();
  }, [post?.id, viewAdded, token]);

  if (!post?.id) {
    return (
      <div className="text-center py-5">
        <h3>Post not found</h3>
        <button
          className="btn btn-primary mt-3"
          onClick={(e) => {
            (e.preventDefault(), navigate(-1));
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setComments({ ...comments, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!token) return navigate("/login");

    fetch("http://localhost:5000/comments/add", {
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
      .then((res) => res.json())
      .then(() => {
        alert("Comment submitted!");
        setComments({ name: "", email: "", message: "" });
      })
      .catch(() => alert("Failed to submit comment"));
  };

  const formattedDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div
        className="site-cover site-cover-sm same-height overlay single-page"
        style={{ backgroundImage: "url('/images/hero_5.jpg')" }}
      >
        <div className="container">
          <div className="row same-height justify-content-center">
            <div className="col-md-6">
              <div className="post-entry text-center">
                <h1 className="mb-4">{post.title}</h1>
                <div className="post-meta">
                  <span>In</span>
                  <span> —{formattedDate(post.created_at)}</span>
                </div>
                <div className="post-meta align-items-center text-center">
                  {/* <figure className="author-figure mb-0 me-3 d-inline-block">
                    <img
                      src="/images/person_1.jpg"
                      alt="Author"
                      className="img-fluid"
                    />
                  </figure> */}
                  <span className="d-inline-block mt-1 fw-semibold">
                    By {post.author}
                  </span>
                  <span>&nbsp;-&nbsp; {post.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <section className="section">
        <div className="container">
          <button
            className="btn btn-outline-secondary mt-2 mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back to Blog
          </button>
          <div className="row blog-entries element-animate">
            {/* MAIN CONTENT */}
            <div className="col-md-12 col-lg-8 main-content">
              <div className="post-content-body">
                <p>{post.content}</p>

                {post.image && (
                  <div className="my-4 ">
                    <img
                      src={post.image}
                      className="img-fluid rounded "
                      style={{ width: "550px", height: "400px" }}
                    />
                  </div>
                )}

                <p className="mt-3 text-muted">
                  Category: <strong>{post.category}</strong>
                </p>

                <p>Written By: {post.author}</p>
                <span className="date">{formattedDate(post.created_at)}</span>
              </div>
              <p className="text-muted mt-3"> {post.views || 0} Views</p>
              {post.commentCount || 0} Comment
              {/* COMMENT FORM */}
              <div className="mt-5">
                <h3>Leave a Comment</h3>
                <form className="p-4 bg-light" onSubmit={handleCommentSubmit}>
                  <input
                    className="form-control mb-3"
                    name="name"
                    placeholder="Name"
                    value={comments.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control mb-3"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={comments.email}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="form-control mb-3"
                    rows="5"
                    name="message"
                    placeholder="Message"
                    value={comments.message}
                    onChange={handleChange}
                  />
                  <button className="btn btn-primary">Post Comment</button>
                </form>
              </div>
            </div>
            {/* SIDEBAR */}

            {/* {token && ( */}
              <div className="col-md-12 col-lg-4 sidebar">
           
                <div className="sidebar-box">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="heading fw-semibold mb-0">Categories</h3>
                    <span className="text-muted">
                      Total: {categories.length}
                    </span>
                  </div>

                  <ul className="categories list-unstyled">
                    {categories.map((cat) => {
                      const categoryName = cat?.name || cat;
                      const postCount = cat?.posts || 0;
                      return (
                        <li key={categoryName}>
                          <a href={`/category/${categoryName}`}>
                            {categoryName} <span>({postCount})</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="sidebar-box">
                  <h3 className="heading">Tags</h3>
                  <ul className="tags">
                    {categories.map((tag) => {
                      const tagName = typeof tag === "object" ? tag.name : tag;

                      return (
                        <li key={tagName}>
                          <a href={`/category/${tagName}`}>
                            #{tagName.toLowerCase()}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            {/* )} */}
          </div>
        </div>
      </section>
    </>
  );
}
