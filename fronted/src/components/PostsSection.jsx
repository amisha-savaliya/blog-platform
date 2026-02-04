import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";

export default function PostsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📅 Date formatter
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/get", {
          method: "POST",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to load posts");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, []);

  // 🧠 Memoized Business posts
  const { bigPosts, sidePosts } = useMemo(() => {
    const business = posts.filter(
      (p) => p.category?.toLowerCase() === "business",
    );

    const sorted = [...business].reverse(); // safe copy

    return {
      bigPosts: sorted.slice(0, 2),
      sidePosts: sorted.slice(2, 5),
    };
  }, [posts]);

  if (loading)
    return <p className="text-center py-5">Loading Business posts...</p>;
  if (error) return <p className="text-danger text-center py-5">{error}</p>;

  return (
    <section className="section posts-entry">
      <div className="container">
        {/* Section Header */}
        <div className="row mb-4 align-items-center">
          <div className="col-sm-6">
            <h2 className="posts-entry-title">Business</h2>
          </div>
          <div className="col-sm-6 text-sm-end">
            <NavLink to="/category/business" className="read-more">
              View All
            </NavLink>
          </div>
        </div>

        <div className="row g-3">
          {/* Big Cards */}
          <div className="col-md-9">
            <div className="row g-3">
              {bigPosts.map((post) => (
                <BigPost key={post.id} post={post} formatDate={formatDate} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-md-3 mt-4 mt-md-0">
            <ul className="list-unstyled blog-entry-sm">
              {sidePosts.map((post) => (
                <SidePost key={post.id} post={post} formatDate={formatDate} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// 🔥 BIG POST COMPONENT
function BigPost({ post, formatDate }) {
  return (
    <div className="col-md-6">
      <div className="blog-entry h-100">
        <NavLink to={`/post/${post.slug}`} className="img-link">
          <img
            src={post.image || "/fallback.jpg"}
            alt={post.title}
            className="post-img"
          />
        </NavLink>
        <br />

        <span className="date">{formatDate(post.created_at)}</span>

        <h2>
          <NavLink to={`/post/${post.slug}`}>{post.title}</NavLink>
        </h2>

        <p>{post.content?.slice(0, 100)}...</p>

        <NavLink
          to={`/post/${post.slug}`}
          className="btn btn-sm btn-outline-primary"
        >
          Read More
        </NavLink>
      </div>
    </div>
  );
}

// 🔥 SIDEBAR POST COMPONENT
function SidePost({ post, formatDate }) {
  return (
    <li>
      <span className="date">{formatDate(post.created_at)}</span>

      <h3>
        <NavLink to={`/post/${post.slug}`}>{post.title}</NavLink>
      </h3>

      <p>{post.content?.slice(0, 60)}...</p>

      <NavLink to={`/post/${post.slug}`} className="read-more">
        Continue Reading
      </NavLink>
    </li>
  );
}
