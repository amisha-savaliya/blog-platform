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

  //  const formattedDate = (date) =>
  //   new Date(date).toLocaleDateString(undefined, {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });

  return (
    <>
      <div className="container py-5 mb-0">
        <h1>Category: {name}</h1>
      </div>

      <div className="section search-result-wrap mt-0">
        <div className="container">
          <div className="row">
            <div className="col-12 h-50">
              <div className="heading d-flex justify-content-between align-items-center ">
                Category: {name}
                <button
                  className="btn btn-outline-secondary mb-2"
                  onClick={() => navigate("/blogpage")}
                >
                  ← Back to Blog
                </button>
              </div>
            </div>
          </div>

          <div className="row posts-entry">
            {/* MAIN POSTS */}
            {loading && (
              <div className="py-5 text-center text-muted">
                <h4>Loading posts...</h4>
              </div>
            )}

            <div className="col-lg-8">
              {!loading && posts.length === 0 ? (
                <div className="py-5 text-center text-muted">
                  <h4>No posts available in this category.</h4>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="blog-entry blog-entry-search-item mb-4"
                  >
                    <div className="row g-3 align-items-start">
                      <div className="col-md-4">
                        <a href={`/post/${post.slug}`} className="img-link">
                          <img
                            src={post.image || "/post.png"}
                            alt={post.title}
                            className="img-fluid rounded"
                          />
                        </a>
                      </div>

                      <div className="col-md-8">
                        <span className="date d-block mb-1">
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

                        <h2 className="mb-2">
                          <Link to={`/post/${post.slug}`}>{post.title}</Link>
                        </h2>

                        <p>{post.content?.substring(0, 150)}...</p>

                        <Link
                          to={`/post/${post.slug}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}

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
