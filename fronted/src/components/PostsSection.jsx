import { useEffect ,useState} from "react";
import { NavLink } from "react-router-dom";

export default function PostsSection() {
 
  const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/get",
        {
          method:"POST"
        }
      )
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch(console.error);
    });

// Only Business category posts
const businessPosts = posts.filter(
  p => p.category?.toLowerCase() === "business"
);


const bigPosts = businessPosts.reverse().slice(0, 2);

const sidePosts = businessPosts.length > 2
  ? businessPosts.slice(2, 5)
  : businessPosts.slice(0, businessPosts.length);


  return (
   <section className="section posts-entry">
  <div className="container">

    <div className="row mb-4">
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

      {/* Left Big Cards */}
      <div className="col-md-9">
        <div className="row g-3">

          {bigPosts.map(post => (
            <div key={post.id} className="col-md-6">
              <div className="blog-entry">

                <NavLink to={`/post/${post.slug}`} className="img-link ">
                  <img src={post.image} className="img-fluid h-100" style={{minHeight:"400px"}} />
                </NavLink>

                <span className="date">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <h2>
                  <NavLink to={`/post/${post.slug}`}>{post.title}</NavLink>
                </h2>

                <p>{post.content.slice(0, 80)}...</p>

                <p>
                  <NavLink to={`/post/${post.slug}`} className="btn btn-sm btn-outline-primary">
                    Read More
                  </NavLink>
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Right Small List */}
      <div className="col-md-3 mt-4 mt-md-0" id="sidebar">
        <ul className="list-unstyled blog-entry-sm">

          {sidePosts.map(post => (
            <li key={post.id}>
              <span className="date">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <h3>
                <NavLink to={`/post/${post.slug}`}>{post.title}</NavLink>
              </h3>

              <p>{post.content.slice(0, 60)}...</p>

              <p>
                <NavLink to={`/post/${post.slug}`} className="read-more">
                  Continue Reading
                </NavLink>
              </p>
            </li>
          ))}

        </ul>
      </div>

    </div>
  </div>
</section>
  );
}
