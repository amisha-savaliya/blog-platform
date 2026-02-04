import { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ViewPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem("admintoken");
  const viewAddedRef = useRef(false);

  useEffect(() => {
    fetch(`http://localhost:5000/posts/${slug}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((result) => setPost(result))
      .catch(console.error);
  }, [slug, token]);

  useEffect(() => {
    if (!post?.id || viewAddedRef.current) return;
    viewAddedRef.current = true;

    fetch(`http://localhost:5000/posts/${post.id}/view`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then(() =>
        setPost((prev) => ({ ...prev, views: (prev.views || 0) + 1 }))
      )
      .catch(() => {});
  }, [post?.id, token]);

  if (!post) {
    return (
      <div className="container py-5 my-10">
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Post not found</h3>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </div>
      </div>
    );
  }

  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    // <div className="container mt-5 py-5">
    <div className="max-w-4xl mx-auto px-4 py-10 p-6 mt-24">
      <div className=" rounded-2xl overflow-hidden">
      <div className="p-4 border-b d-flex justify-content-between align-items-center">
         <h1 className="text-3xl font-bold mb-3 text-gray-800">
            {post.title}
          </h1>
           <button
            className="btn btn-primary mb-4 hover:underline"
            onClick={() => navigate(-1)}
          >
            ← Back to Posts
          </button>

          </div>
        {/* IMAGE */}
        {post.image && (
          <div className="w-full h-[350px] overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
      
         

          {/* META INFO */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-black mb-6">
            <span>
              By <strong className="text-gray-700">{post.author}</strong>
            </span>
            <span>• {formattedDate(post.created_at)}</span>
            <br/>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          {/* CONTENT */}
          <p className="text-gray-700 leading-8 text-[17px] whitespace-pre-line">
            {post.content}
          </p>

          {/* STATS */}
          <div className="border-t mt-8 pt-5 d-flex gap-5 text-sm">
          <span>
              <i className="fas fa-heart text-red-500"></i> {post.totalLikes || 0} Likes
            </span>
               <span>
              <i className="fas fa-comment text-muted "></i> {post.commentCount > 0 ? post.commentCount : 0} Comments
            </span>
            <span><i className="fas fa-eye text-primary"></i> {post.views || 0} Views</span>
         
            
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

