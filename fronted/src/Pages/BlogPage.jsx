import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Addpost from "./Addpost";
import { useCategories } from "../context/Categorycontext";
import AllCommentsModal from "../admin/pages/AllCommentModel";

export default function BlogPage() {
  const navigate = useNavigate();
  const impersonationToken = sessionStorage.getItem("impersonationToken");
  const normalToken = localStorage.getItem("token");
  const token = impersonationToken || normalToken;
  const isImpersonating = sessionStorage.getItem("isImpersonating") === "true";
  const { categories } = useCategories();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [commentText, setCommentText] = useState({});
  const limit = 6;
  const [showModal, setShowModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const openComments = (postId) => {
    setActivePostId(postId);
    setShowModal(true);
    loadComments();
  };
  const closeComments = () => {
    setShowModal(false);
    setActivePostId(null);
  };

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
  useEffect(() => {
    if (token) {
      loadComments();
    }
  }, [token]);

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
    alert("comment added ");
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    loadComments();
  };

  /* RESET PAGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  /* - FETCH POSTS*/
  useEffect(() => {
    const options = token
      ? { headers: { Authorization: "Bearer " + token } }
      : {};

    let url = `http://localhost:5000/allpost?page=${currentPage}&limit=${limit}`;

    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }

    if (search) {
      url += `&search=${search}`;
    }

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.post || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  }, [currentPage, selectedCategory, search, token]);

  /* --SEARCH HIGHLIGHT --- */
  const SearchHighlight = (text = "") => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark className="bg-warning" key={i}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const formattedDate = (date) =>
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
    <>
      <div className="container section">
        {/* Header */}
        <div className="row align-items-center mb-3">
          <div className="col">
            <h2 className="heading text-primary m-0">Blog Posts</h2>
          </div>

          <div className="col-12 col-md-auto">
            <div className="d-flex gap-2">
              {token || isImpersonating ? (
                <>
                  <select
                    className="form-select"
                    style={{ width: "180px", height: "50px" }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="form-control"
                    style={{ width: "220px", height: "50px" }}
                    placeholder="🔍 Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </>
              ) : (
                <></>
              )}

              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add Blog
              </button>
            </div>
          </div>
        </div>

        {search && (
          <small className="text-muted">
            Showing results for "<b>{search}</b>"
          </small>
        )}

        {/* Posts */}
        <div className="row g-4 mt-2">
          {posts.length === 0 ? (
            <h4 className="text-muted">
              No posts found {selectedCategory} category
            </h4>
          ) : (
            posts.map((p) => (
              <div className="col-md-4" key={p.id}>
                <div className="card h-100 p-3 shadow-sm">
                  <img
                    src={p.image}
                    alt=""
                    className="img-fluid rounded mb-2"
                    style={{ height: "250px", objectFit: "cover" }}
                  />

                  <h4 className="mt-3">{SearchHighlight(p.title)}</h4>
                  <span className="badge bg-primary mb-2 h-8">
                    {SearchHighlight(p.category)}
                  </span>

                  <p>
                    {SearchHighlight((p.content || "").slice(0, 150))}
                    {p.content && "..."}
                  </p>

                  <p> Written By :{p.author}</p>
                  <small className="text-muted">
                    {formattedDate(p.created_at)}
                  </small>

                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={() => navigate(`/post/${p.slug}`)}
                  >
                    Read More →
                  </button>
                  {token || impersonationToken ? (
                    <div className=" card-footer d-flex gap-4 align-items-center mt-3  ">
                      <button
                        className={p.userLiked ? "text-danger" : "text-muted"}
                        onClick={() => handleLike(p.id)}
                      >
                        {p.userLiked ? "❤️" : "🤍"} {p.totalLikes}
                      </button>{" "}
                      <button
                        className="text-black fs-50"
                        onClick={() => openComments(p.id)}
                      >
                        <i className="fa-regular fa-comment me-1"></i>{" "}
                        {p.commentCount}
                      </button>
                      <button className={"text-primary fw-bold me-1"}>
                        <i className="fa-solid fa-eye"></i> {p.views || 0}
                      </button>{" "}
                    </div>
                  ) : (
                    " "
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
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

        {showForm && (
          <Addpost
            onAdd={(newPost) => setPosts([newPost, ...posts])}
            onClose={() => setShowForm(false)}
          />
        )}

        <AllCommentsModal
          showModal={showModal}
          closeComments={closeComments}
          comments={comments}
          activePostId={activePostId}
          formattedDate={formattedDate}
        />
      </div>
    </>
  );
}
