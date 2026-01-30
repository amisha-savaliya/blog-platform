import React from "react";
import CardStats from "../../components/Cards/CardStats";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderStats() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [posts, setPosts] = useState([]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("admintoken");

    if (!token) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:5000/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/category/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/posts/get", {
      method:"POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
      
  }, []);


  // Recent posts (last 7 days)
  const recentPosts = posts.filter((p) => {
    const postDate = new Date(p.created_at);
    const now = new Date();
    const diff = (now - postDate) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  return (
    <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
      <div className="px-4 md:px-10 mx-auto w-full">
        <div className="flex flex-wrap">
          <div className="w-full sm:w-12/12 lg:w-6/12 xl:w-3/12 px-4">
            <CardStats
              statSubtitle="TOTAL POSTS"
              statTitle={posts.length}
              statIconName="far fa-newspaper"
              statIconColor="bg-red-500"
              statDescripiron="All published posts"
            />
          </div>

          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <CardStats
              statSubtitle="TOTAL USERS"
              statTitle={users.length}
              statIconName="fas fa-users"
              statIconColor="bg-orange-500"
              statDescripiron="Registered users"
            />
          </div>

          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <CardStats
              statSubtitle="CATEGORIES"
              statTitle={categories.length}
              statIconName="fas fa-tags"
              statIconColor="bg-pink-500"
              statDescripiron="Blog categories"
            />
          </div>

          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <CardStats
              statSubtitle="RECENT POSTS"
              statTitle={recentPosts.length}
              statIconName="fas fa-clock"
              statIconColor="bg-lightBlue-500"
              statDescripiron="Last 7 days"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
