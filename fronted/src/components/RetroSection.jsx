import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function RetroSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // 📅 Date formatter (defined once)
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // 🚀 Fetch posts
  useEffect(() => {
    const controller = new AbortController();

    const getPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/get", {
          method: "POST",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
    return () => controller.abort(); 
  }, []);


  const featured = useMemo(() => {
    return [...posts].reverse().slice(0, 7);
  }, [posts]);

  if (loading) return <p className="text-center py-5">Loading posts...</p>;
  if (error) return <p className="text-danger text-center py-5">{error}</p>;

  return (
    <section className="section">
      <div className="container">

        {user && (
          <div className="welcome-banner text-center fs-5 mb-4">
            Welcome back, <b>{user.name}</b> 👋
          </div>
        )}

        <div className="row align-items-stretch retro-layout">

          {/* LEFT COLUMN */}
          <div className="col-md-4">
            {featured.slice(0, 2).map((p) => (
              <PostCard key={p.id} post={p} formatDate={formatDate} />
            ))}
          </div>

          {/* CENTER BIG */}
          <div className="col-md-4">
            {featured[2] && (
              <PostCard post={featured[2]} big formatDate={formatDate} />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-4">
            {featured.slice(3, 5).map((p) => (
              <PostCard key={p.id} post={p} formatDate={formatDate} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}


function PostCard({ post, formatDate, big }) {
  return (
    <NavLink
      to={`/post/${post.slug}`}
      className={`h-entry gradient ${big ? "img-5 h-100" : "mb-30 v-height"}`}
    >
      <div
        className="featured-img"
        style={{ backgroundImage: `url(${post.image})` }}
      />
      <div className="text">
        <span className="date">{formatDate(post.created_at)}</span>
        <h2>{post.title}</h2>
      </div>
    </NavLink>
  );
}
