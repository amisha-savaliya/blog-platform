import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostChart from "../../components/Cards/PostChart";
import HeaderStats from "../../components/Headers/HeaderStats";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("7");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  useEffect(() => {
    if (!token) return navigate("/admin/login");

    setLoading(true);

    fetch(`http://localhost:5000/posts/get?range=${range}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setChartData(data.chartStats || []);
        setLoading(false);
      })
      .catch(() => navigate("/admin/login"));
  }, [range, token, navigate]);

  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse bg-gray-200 h-40 rounded mb-6"></div>
        <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
      </div>
    );
  }
return (
  <div className="px-4 md:px-8 py-6 space-y-6 mt-3 md:ml-72 pt-16 md:pt-0">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <HeaderStats />
    </div>

    <div className="bg-white p-5 rounded-2xl shadow">
      <h4 className="font-semibold text-gray-700 mb-3">
        Post Activity
      </h4>
      <PostChart data={chartData} />
    </div>

    <div className="bg-white p-5 rounded-2xl shadow">
      <h4 className="font-semibold text-gray-700 mb-4">
        🔥 Top Performing Posts
      </h4>

      {topPosts.slice(0, 5).map((p, i) => (
        <div
          key={p.id}
          className="flex justify-between items-center border-b py-3 last:border-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">#{i + 1}</span>
            <span className="font-medium text-gray-800">{p.title}</span>
          </div>

          <span className="text-sm text-gray-500">
            {p.views || 0} views
          </span>
        </div>
      ))}
    </div>
  </div>
);

}
