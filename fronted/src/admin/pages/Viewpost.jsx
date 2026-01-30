import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ViewPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admintoken");

    fetch(`http://localhost:5000/posts/slug/${slug}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result)
      })
      .catch(console.error);

    
    }, [slug]);

  if (!post) {
    return (
      <div className="text-center py-5">
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }
    const formattedDate = date =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        
          {post.image && (
            <div className="my-4 ">
              <img src={post.image} className="img-fluid rounded " style={{width:"550px",height:"400px"}} />
            </div>
          )}

        <h1 className="mb-2">{post.title}</h1>

        <div className="mb-3 text-primary fw-semibold">
          {post.views || 0} Views{" "}<br/>
          {post.commentCount || 0} Comments
 
        </div>

        <div className="mb-3 text-primary">Category: {post.category}</div>

        <p style={{ fontSize: "18px", lineHeight: "1.7" }}>{post.content}</p>

         <div className="mb-3 text-black">
          By <strong>{post.author}</strong> • {formattedDate(post.created_at)}
        </div>

        <button
          className="btn btn-outline-secondary mt-4"
          onClick={() => navigate(-1)}
        >
          ← Back to Blog
        </button>
      </div>
      
    </div>
  );
}
