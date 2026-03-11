import { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroPosts } from "../features/posts/postsSlice";
import { selectActiveUser } from "../features/auth/authSlice";

// 📅 Date formatter (outside component)
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function RetroSection() {
  const dispatch = useDispatch();

  const user  = useSelector(selectActiveUser)
  const { heroPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchHeroPosts());
  }, [dispatch]);

  const featured = useMemo(() => {
    if (!heroPosts?.length) return [];
    return [...heroPosts].reverse().slice(0, 7);
  }, [heroPosts]);

  if (loading) return <p className="text-center py-5">Loading posts...</p>;
  if (error) return <p className="text-danger text-center py-5">{error}</p>;

  return (
    <section className="section">
      <div className="container">
        {user && (
          <div className="welcome-banner text-center fs-5 mb-4 mt-2">
            Welcome back, <b>{user.name}</b> 👋
          </div>
        )}

        <div className="row align-items-stretch retro-layout">
          <div className="col-md-4">
            {featured.slice(0, 2).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>

          <div className="col-md-4">
            {featured[2] && <PostCard post={featured[2]} big />}
          </div>

          <div className="col-md-4">
            {featured.slice(3, 5).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, big }) {
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