import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  setCategory,
  setSearch,
  setPage,
  likePost,
} from "../features/posts/postsSlice";
import { useNavigate } from "react-router-dom";
import CommentsModal from "../components/CommentModel";
import Addpost from "../Pages/Addpost";
import { selectActiveToken, selectActiveUser } from "../features/auth/authSlice";

export default function BlogPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectActiveUser);

  const {
    posts,
    loadingPosts,
    currentPage,
    totalPages,
    selectedCategory,
    search,
  } = useSelector((state) => state.posts);

  const navigate = useNavigate();
  const token =useSelector(selectActiveToken)
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

 useEffect(() => {
  // If search is empty → load all posts
  if (!debouncedSearch) {
    dispatch(fetchPosts({ search: "" }));
    return;
  }

  // Only call API when search length >= 3
  if (debouncedSearch.length >= 3) {
    dispatch(fetchPosts({ search: debouncedSearch }));
  }

}, [dispatch, currentPage, selectedCategory, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);
  const { categories } = useSelector((s)=>s.category);

  const SearchHighlight = (text = "") => {
    if (!debouncedSearch || debouncedSearch.length < 3) return text;

    const escaped = debouncedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === debouncedSearch.toLowerCase() ? (
        <mark className="bg-warning px-1" key={i}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };


  const openComments = (postId) => {
  setActivePostId(postId);
  setShowModal(true);
};

const closeComments = () => {
  setShowModal(false);
  setActivePostId(null);
};

  const formateDate = (date) => 
     new Date(date).toLocaleDateString(undefined,  {
      year: "numeric",
      month: "long",
      day:"numeric"
    });
    if(loadingPosts)
    {
      return <div className="container py-5"> Loading posts</div>
    }
  
  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 mb-4 mt-5">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            {/* LEFT SIDE — TITLE */}
            <h2 className="heading text-primary fw-bold mb-0">Blog Posts</h2>

            {/* RIGHT SIDE — FILTERS + SEARCH + BUTTON */}
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
              <select
                className="form-select"
                style={{ width: "180px", height: "42px" }}
                value={selectedCategory}
                onChange={(e) => dispatch(setCategory(e.target.value))}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control m-1"
                style={{ width: "220px", height: "42px" }}
                placeholder="Search..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />

              <button
                className="btn btn-primary px-3 py-2 text-center m-1"
                style={{ height: "40px" }}
                onClick={() => setShowForm(true)}
              >
                <i className="fa-solid fa-plus me-1"></i>
                Add Blog
              </button>
            </div>
          </div>
        </div>
      </div>

      {search && (
        <p className="text-muted mb-3">
          Showing results for <b>"{search}"</b>
        </p>
      )}

      {/* ===== POSTS ===== */}
      <div className="row g-4">
        {posts.length === 0 ? (
          <div className="text-center py-5">
            <i className="fa-regular fa-folder-open fs-1 text-muted mb-2"></i>
            <h5 className="text-muted">No posts found</h5>
          </div>
        ) : (
          posts.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="card h-100 border-0 shadow-sm blog-card">
                {/* Image */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />

                {/* Body */}
                <div className="card-body">
                  <span className="badge bg-primary mb-2">{p.category}</span>
                  <h5 className="fw-semibold">{SearchHighlight(p.title)}</h5>
                  <p className="text-muted small mb-2">
                    By <b>{p.author}</b> • {formateDate(p.created_at)}
                  </p>
                  <p className="text-secondary">
                    {SearchHighlight(p.content.slice(0, 120))}...
                  </p>{" "}
                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/post/${p.slug}`)}
                  >
                    Read More
                  </button>

                  <div className="d-flex gap-3 align-items-center">
                    <button
                      className="btn btn-link p-0 text-decoration-none fs-6"
                      onClick={() => dispatch(likePost(p.id))}
                    >
                      {p.userLiked ? "❤️" : "🤍"} {p.totalLikes}
                    </button>

                    <button
                      className="btn btn-link p-0 text-decoration-none text-dark fs-6"
                      onClick={() => openComments(p.id)}
                    >
                      <i className="fa-regular fa-comment"></i> {p.commentCount}
                    </button>

                    <span className="text-muted small fs-6">
                      <i className="fa-solid fa-eye text-primary"></i>{" "}
                      {p.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>

        <span className="fw-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>

      {/* ===== MODALS ===== */}
      {showForm && (
        <Addpost
          onAdd={(newPost) => posts([newPost, ...posts])}
          onClose={() => setShowForm(false)}
        />
      )}

      <CommentsModal
        postId={activePostId}
        token={token}
        currentUser={user}
        show={showModal}
        onClose={closeComments}
        dateFormate={formateDate}
      />
    </div>
  );
}
