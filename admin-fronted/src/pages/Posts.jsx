import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommentModal from "./CommentModel";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePost,
  fetchPosts,
  likePost,
  setPage,
} from "../Redux/features/posts/postsSlice";
import { fetchComments } from "../Redux/features/comments/commentSlice";

export default function Posts() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

const totalPages = useSelector((s) => s.posts.totalPages);
const currentPage = useSelector((s) => s.posts.currentPage);
const posts = useSelector((s) => s.posts.posts);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 100); // wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openComments = (postId) => {
    setSelectedPostId(postId);
    dispatch(fetchComments({ postId }));
    setShowComments(true);
  };

  // Reset page when search changes
  useEffect(() => {
    if (searchQuery) {
      dispatch(setPage(1));
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (!token) return;

    if (debouncedSearch && debouncedSearch.length < 3) return;

    dispatch(
      fetchPosts({
        search: debouncedSearch,
      }),
    );
  }, [debouncedSearch, currentPage, token, dispatch]);

  const removePost = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    dispatch(deletePost(slug));
  };

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour12: true,
    });
  const SearchHighlight = (text) => {
    if (!debouncedSearch || debouncedSearch.length < 3) return text;

    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === debouncedSearch.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div
      className="grid gap-6 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4"
    >
      <div className=" rounded-xl shadow-md overflow-hidden flex flex-col">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* LEFT SIDE */}
          <div className="d-flex align-items-center gap-lg-5 p-2 gap-md-5 sm">
            <h2 className="fw-bold text-primary-emphasis m-1 mb-2 fs-2">
              <i className="fa-solid fa-newspaper me-2"></i>
              Blog Posts
            </h2>

            {searchQuery && (
              <small className="text-muted">
                Results for "<b>{searchQuery}</b>"
              </small>
            )}
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap p-2 mb-3">
            <div
              style={{ minWidth: "260px" }}
              className="pt-2 d-flex align-items-center gap-2"
            >
              <input
                type="text"
                placeholder="🔍 Search posts..."
                style={{ borderRadius: "6px" }}
                className="form-control"
                value={searchQuery}
                onChange={(e) => navigate(`/posts?search=${e.target.value}`)}
              />
            </div>

            <button
              className="btn btn-primary px-4 shadow-sm"
              onClick={() => navigate("/posts/add")}
            >
              <i className="fa fa-plus me-2"></i>
              Add Blog
            </button>
          </div>
        </div>
      </div>

      {posts.length === 0 && <p>No posts found.</p>}

      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-md-4 " key={post.id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 post-card">
              {/* IMAGE */}
              <div className="position-relative">
                <img
                  src={post.image}
                  className="w-full h-48 object-cover"
                  alt=""
                  style={{ height: "280px", objectFit: "cover" }}
                />

                {/* CATEGORY BADGE */}
                <span className="badge bg-primary position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill">
                  {post.category}
                </span>
              </div>

              {/* BODY */}
              <div className="card-body d-flex flex-column">
                <h5 className="text-lg font-semibold line-clamp-2">
                  {SearchHighlight(post.title)}
                </h5>

                <small className="text-muted mb-2 mt-0">
                  By <b>{post.author} </b>• {formattedDate(post.created_at)}
                </small>

                <p className="text-muted small flex-grow-1 fs-6 line-clamp-3">
                  {SearchHighlight((post.content || "").substring(0, 110))}...
                </p>

                {/* ACTION BUTTONS */}
                <div className="d-flex justify-content-between align-items-center mt-2 ">
                  <div className="btn-group btn-group-sm gap-3">
                    <button
                      className="btn btn-light border "
                      onClick={() => navigate(`/post/${post.slug}`)}
                    >
                      <i className="fa-solid fa-eye text-primary"></i>
                    </button>
                    <button
                      className="btn btn-light border"
                      onClick={() => navigate(`/edit-post/${post.slug}`)}
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
                  {/* <span className="text-muted small">
                    {formattedDate(post.created_at)}
                  </span> */}
                </div>
              </div>

              {/* FOOTER */}
              <div className="card-footer bg-white border-0 mt-auto flex justify-between items-center pt-4">
                <button
                  className={
                    post.userLiked ? "text-danger fw-semibold" : "text-muted"
                  }
                  onClick={() => dispatch(likePost(post.id))}
                >
                  {post.userLiked ? "❤️ " : "🤍 "} {post.totalLikes || 0}
                </button>

                <button
                  className="text-muted"
                  onClick={() => openComments(post.id)}
                >
                  <i className="fa-regular fa-comment"></i> {post.commentCount}
                </button>

                <span className="text-muted">
                  <i className="fa-solid fa-eye me-1"></i>
                  {post.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
        <button
          className="btn btn-sm btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-sm btn-outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>

      <CommentModal
        show={showComments}
        onClose={() => setShowComments(false)}
        postId={selectedPostId}
        // currentUserId={user?.id}
      />
    </div>
  );
}
