import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../context/Categorycontext";

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // 🔹 Fetch posts
  useEffect(() => {
    setLoading(true);

    fetch(
      `http://localhost:5000/category/${name}?page=${currentPage}&limit=${limit}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [name, currentPage]);

  // 🔹 Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [name]);

  return (
    <>
      <div className="container py-4 mb-0 mt-4">
        <div className="row">
          <div className="col-12 h-25">
            <div className="heading d-flex justify-content-between align-items-center ">
              <h1>Category: <strong className="text-black">{name}</strong></h1>
              <button
                className="btn btn-primary mb-2"
                onClick={() => navigate("/blogpage")}
              >
                ← Back to Blog
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section search-result-wrap mt-0">
        <div className="container">
          <div className="row posts-entry">
            <div className="col-lg-8">
              {/* LOADING */}
              {loading && (
                <div className="py-5 text-center text-muted">
                  <h4>Loading posts...</h4>
                </div>
              )}

              {/* NO POSTS */}
              {!loading && posts.length === 0 && (
                <div className="py-5 text-center text-muted">
                  <h4>No posts available in this category.</h4>
                </div>
              )}

              {/* POSTS */}
              {!loading &&
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="blog-entry mb-4 p-3 bg-white rounded shadow-sm"
                  >
                    <div className="row g-4 align-items-center">
                      <div className="col-md-4">
                        <Link
                          to={`/post/${post.slug}`}
                          className="d-block overflow-hidden rounded"
                        >
                          <img
                            src={post.image || "/post.png"}
                            alt={post.title}
                            style={{
                              width: "100%",
                              height: "220px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                        </Link>
                      </div>

                      <div className="col-md-8">
                        <span className="date d-block mb-1 text-muted small">
                          {new Date(post.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          •{" "}
                          <span className="text-primary">{post.category}</span>
                        </span>

                        <h5 className="mb-2 fw-bold">
                          <Link
                            to={`/post/${post.slug}`}
                            className="text-dark text-decoration-none"
                          >
                            {post.title}
                          </Link>
                        </h5>
                        <p className="text-muted small mb-2">
                          {post.content?.substring(0, 120)}...
                        </p>

                        <Link
                          to={`/post/${post.slug}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${
                        currentPage === i + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="col-md-12 col-lg-4 sidebar">
              <div className="sidebar-box">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="heading fw-semibold mb-0">Categories</h3>
                  <span className="text-muted">Total: {categories.length}</span>
                </div>

                <ul className="categories">
                  {categories.map((cat) => {
                    const categoryName =
                      typeof cat === "object" ? cat.name : cat;

                    return (
                      <li key={categoryName}>
                        <Link to={`/category/${categoryName}`}>
                          {categoryName} <span>({cat.posts})</span>
                        </Link>
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
                        <Link to={`/category/${tagName}`}>
                          #{tagName.toLowerCase()}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
