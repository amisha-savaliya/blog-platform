import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchCategoryPosts} from "../features/posts/postsSlice";

export default function PostsSection() {
  const dispatch = useDispatch();

  const {
    categoryPosts = [],
    loading,
    error,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchCategoryPosts("Business"));
  }, [dispatch]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // ✅ ONLY split posts, no filtering
  const { bigPosts, sidePosts } = useMemo(() => {
    return {
      bigPosts: categoryPosts.slice(0, 2),
      sidePosts: categoryPosts.slice(2, 5),
    };
  }, [categoryPosts]);

  if (loading)
    return (
      <section className="section posts-entry">
        <p className="text-center py-5">Loading Business posts…</p>
      </section>
    );

  if (error)
    return (
      <section className="section posts-entry">
        <p className="text-danger text-center py-5">{error}</p>
      </section>
    );

  if (!categoryPosts.length)
    return (
      <section className="section posts-entry">
        <p className="text-center py-5">No business posts found.</p>
      </section>
    );

  return (
    <section className="section posts-entry">
      <div className="container">
        {/* HEADER */}
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

        {/* CONTENT */}
        <div className="row g-4">
          {/* BIG POSTS */}
          <div className="col-md-9">
            <div className="row g-4">
              {bigPosts.map((post) => (
                <BigPost key={post.id} post={post} formatDate={formatDate} />
              ))}
            </div>
          </div>

          {/* SIDEBAR POSTS */}
          <div className="col-md-3">
            <ul className="list-unstyled blog-entry-sm d-flex flex-column gap-3">
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



function BigPost({ post, formatDate }) {
  return (
    <div className="col-md-6">
      <div className="blog-entry h-100 d-flex flex-column">
        <NavLink to={`/post/${post.slug}`} className="img-link">
          <img
            src={post.image || "/fallback.jpg"}
            alt={post.title}
            className="post-img rounded"
          />
        </NavLink>

        <div className="mt-3">
          <span className="date">{formatDate(post.created_at)}</span>

          <h2 className="mt-2">
            <NavLink to={`/post/${post.slug}`}>{post.title}</NavLink>
          </h2>

          <p className="text-muted">
            {post.content?.slice(0, 120)}…
          </p>

          <NavLink
            to={`/post/${post.slug}`}
            className="btn btn-sm btn-outline-primary mt-auto"
          >
            Read More
          </NavLink>
        </div>
      </div>
    </div>
  );
}
function SidePost({ post, formatDate }) {
  return (
    <li className="border-bottom pb-3">
      <span className="date d-block mb-1">
        {formatDate(post.created_at)}
      </span>

      <h3 className="h6 mb-1">
        <NavLink to={`/post/${post.slug}`}>{post.title}</NavLink>
      </h3>

      <p className="text-muted small mb-2">
        {post.content?.slice(0, 70)}…
      </p>

      <NavLink to={`/post/${post.slug}`} className="read-more small">
        Continue Reading →
      </NavLink>
    </li>
  );
}