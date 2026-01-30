import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/Authcontext"; 

export default function RetroSection() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth(); 

  
  useEffect(() => {
    fetch("http://localhost:5000/get", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);  

  const featured = [...posts].reverse().slice(0, 7);

  return (
    <section className="section bg-light">
      <div className="container">

      
        {user && (
          <div className="alert alert-light text-center fs-5">
            Welcome back, <b>{user.name}</b> 👋
          </div>
        )}

        <div className="row align-items-stretch retro-layout">
          <div className="row">
            <div className="col-md-4">
              {featured.slice(0, 2).map((p, index) => (
                <NavLink key={index} to={`/post/${p.slug}`} className="h-entry mb-30 v-height gradient">
                  <div className="featured-img" style={{ backgroundImage: `url(${p.image})` }} />
                  <div className="text">
                    <span className="date">
                      {new Date(p.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                    <h2>{p.title}</h2>
                  </div>
                </NavLink>
              ))}
            </div>

            <div className="col-md-4">
              {featured[2] && (
                <NavLink to={`/post/${featured[2].slug}`} className="h-entry img-5 h-100 gradient">
                  <div className="featured-img" style={{ backgroundImage: `url(${featured[2].image})` }} />
                  <div className="text">
                    <span className="date">
                      {new Date(featured[2].created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                    <h2>{featured[2].title}</h2>
                  </div>
                </NavLink>
              )}
            </div>

            <div className="col-md-4">
              {featured.slice(3, 5).map((p) => (
                <NavLink key={p.id} to={`/post/${p.slug}`} className="h-entry mb-30 v-height gradient">
                  <div className="featured-img" style={{ backgroundImage: `url(${p.image})` }} />
                  <div className="text">
                    <span className="date">
                      {new Date(p.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                    <h2>{p.title}</h2>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
