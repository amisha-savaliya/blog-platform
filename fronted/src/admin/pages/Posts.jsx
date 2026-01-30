import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommentModal from "./CommentModel";
import { useAuth } from "../../context/Authcontext";

export default function Posts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const token = localStorage.getItem("admintoken");
  const limit = 6;

  // const [comments, setComments] = useState([]);

  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [modalComments, setModalComments] = useState([]);

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
    loadComments();
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  //  Fetch posts with search + pagination
  useEffect(() => {
    fetch(
      `http://localhost:5000/posts?search=${encodeURIComponent(
        searchQuery,
      )}&page=${currentPage}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  }, [searchQuery, currentPage, token]);

  const removePost = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await fetch(`http://localhost:5000/posts/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
    }
  };

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour12: true,
    });

  const SearchHighlight = (text) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
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
    <div className="container section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading text-primary">Blog Posts</h2>

        {searchQuery && (
          <small className="text-muted">
            Showing results for "<b>{searchQuery}</b>"
          </small>
        )}

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/posts/add")}
        >
          + Add Blog
        </button>
      </div>

      {posts.length === 0 && <p>No posts found.</p>}

      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-md-4" key={post.id}>
            <div
              className="post-entry bg-white p-3 shadow-sm rounded"
              style={{ minHeight: "520px" }}
            >
              <img
                src={post.image}
                className="img-fluid mb-3 rounded"
                alt=""
                style={{ height: "250px", width: "400px" }}
              />

              <h4>{SearchHighlight(post.title)}</h4>

              <span className="d-block text-primary">
                By <span className="text-muted">{post.author}</span>
              </span>

              <span className="d-block text-primary">
                {SearchHighlight(post.category)}
              </span>

              <p className="mt-2">
                {SearchHighlight(post.content.substring(0, 100))}...
              </p>

              <div className="d-flex align-items-center gap-2 mt-3 mb-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/admin/post/${post.slug}`)}
                >
                  <i className="fa-solid fa-eye"></i>
                </button>

                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => navigate(`/admin/edit-post/${post.slug}`)}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removePost(post.slug)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>

                <small className="text-muted ms-auto">
                  {formattedDate(post.created_at)}
                </small>
              </div>
              {/* card footer*/}
              <div className=" card-footer d-flex gap-2 align-items-center mt-1 mb-0">
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
                  onClick={() => openComments(post.id)}
                >
                  <i className="fa-regular fa-comment"></i> {post.commentCount}
                </button>{" "}
                <button className="btn btn-outline-none fs-6">
                  <i className="fa fa-eye"></i> {post.views}
                </button>
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
