import React from "react";

import PostChart from "../../components/Cards/PostChart";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  useEffect(() => {
      if (!token) {
    navigate("/admin/login");
    return;
      }

    fetch("http://localhost:5000/posts/get", {
      method:"POST",
        headers: { Authorization: "Bearer " + token },  
      })
       .then(res => {
      if (!res.ok) return new Error("Unauthorized");
      return res.json();
    })
    .then(setPosts)
    .catch(err => {
      console.error(err);
      navigate("/admin/login");
    });

}, [token, navigate]);


  const sorted = posts.sort((a, b) => (b.views || 0) - (a.views || 0));
  return (
    <>
      <div className="flex flex-wrap px-1">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <PostChart />
        </div>
        {/* <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div> */}
      </div>

      {/* <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div>
      </div> */}

      <div className="container mt-5 bg-white rounded-xl shadow px-4">
        <h3 className="font-semibold mb-4 p-2">Top Performing Posts</h3>

        {sorted.slice(0, 5).map((p) => (
          <div key={p.id} className="border-b py-2 flex justify-between">
          <p>{p.id}</p>
            <span>{p.title}</span>
            <span className="text-sm text-black-500">{p.views || 0} views</span>
          </div>
        ))}
      </div>
    </>
  );
}
