import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AllCommentsModal from "./AllCommentModel";

const UserPost = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, userName } = location.state || {};

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const openComments = (postId) => {
    setActivePostId(postId);
    setShowModal(true);
  };

  const closeComments = () => {
    setShowModal(false);
    setActivePostId(null);
  };

  const token = localStorage.getItem("admintoken");

  useEffect(() => {
    if (!userId) {
      navigate(-1);
      return;
    }

    fetch(
      `http://localhost:5000/posts?userId=${userId}&page=${currentPage}&limit=6`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log("API RESPONSE:", data);
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  }, [userId, currentPage, token]);

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

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour12: true,
    });

  return (
    <div className="container section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading text-primary">
          Posts By : <b className="text-capitalize">{userName}</b>
        </h2>
        <span>Total posts : {posts.length}</span>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
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
                className="post-entry bg-white p-3 shadow-sm rounded"
                style={{ minHeight: "520px" }}
              >
                <img
                  src={post.image}
                  className="img-fluid mb-3 rounded"
                  alt=""
                  style={{ height: "250px", width: "" }}
                />

                <h4>{post.title}</h4>

                <span className="d-block text-primary">
                  By <span className="text-muted">{post.author}</span>
                </span>

                <span className="d-block text-primary">{post.category}</span>

                <p className="mt-2">{post.content.substring(0, 100)}...</p>

                <div className="d-flex align-items-center gap-2 mt-3">
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
                {/* COMMENTS PREVIEW */}

                <div className="d-flex gap-2 align-items-start mt-3 mb-2"></div>


               
                  <button
                    className="btn btn-link p-0 mt-1 cursor-pointer"
                    onClick={() => openComments(post.id)}
                  >
                    More comments ({comments[post.id]?.length || 0})
                  </button>
             
              </div>
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
          ))}
        </div>
      )}

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

      <AllCommentsModal
        showModal={showModal}
        closeComments={closeComments}
        comments={comments}
        activePostId={activePostId}
        formattedDate={formattedDate}
      />
    </div>
  );
};

export default UserPost;
