import React from "react";

import PostChart from "../../components/Cards/PostChart";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderStats from "../../components/Headers/HeaderStats";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [chartData, setChartData] = useState([]); 
  const [range, setRange] = useState("7"); 
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate(); 
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/posts/get?range=${range}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts);
        setChartData(data.chartStats);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate("/admin/login");
      });
  }, [token, navigate, range]); // ✅ reload when range changes

  const sorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));


  if (loading) {
    return (
      <div className="px-4">
        <div className="skeleton h-64 rounded mb-6"></div>

        <div className="bg-white rounded-xl shadow px-4 py-4">
          <div className="skeleton h-6 w-48 mb-4"></div>

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-3 border-b">
              <div className="skeleton h-4 w-10"></div>
              <div className="skeleton h-4 w-40"></div>
              <div className="skeleton h-4 w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
     <div className="bg-blue-600 p-6 rounded-xl text-white mb-6">
        <div className="grid grid-cols-4 gap-6">
          <HeaderStats />
        </div>
      <div className="flex flex-wrap px-1">
      
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
           <PostChart data={chartData} /> 
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
        <h3 className="font-semibold mb-4 p-2 text-black">Top Performing Posts</h3>

        {sorted.slice(0, 5).map((p) => (
          <div key={p.id} className="border-b py-2 flex justify-between">
          <p>#{p.id}</p>
            <span>{p.title}</span>
            <span className="text-sm text-black-500">{p.views || 0} views</span>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
