import React, { useEffect, useState } from "react";
import PostChart from "../../components/Cards/PostChart";
import HeaderStats from "../../components/Headers/HeaderStats";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboard } from "../../Redux/features/dashboard/dashboardSlice";
import { fetchAllCategory } from "../../Redux/features/category/categorySlice";

export default function Dashboard() {
  const dispatch = useDispatch();


  const [range, setRange] = useState("all");


   const { chartStats, posts, loading } = useSelector(
    (state) => state.dashboard
  );

  const { categories } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchDashboard(range));
    dispatch(fetchAllCategory()); // fetch all categories
  }, [range, dispatch]);

  //  Merge categories + chartStats
  const labels = categories?.map((cat) => cat.name) || [];

  const dataCounts = categories?.map((cat) => {
    const found = chartStats.find(
      (stat) => stat.name === cat.name
    );
    return found ? found.total : 0; // default 0
  }) || [];


  const chartData = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: dataCounts,
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };


  const topPosts = [...posts].sort(
    (a, b) => (b.views || 0) - (a.views || 0)
  );

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
           {loading ? (
        <p>Loading...</p>
      ) : (
        <PostChart
          chartData={chartData}
          totalPosts={posts.length}
          range={range}
          setRange={setRange}
        />
      )}
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
              <span className="text-gray-400 text-sm">
                #{i + 1}
              </span>
              <span className="font-medium text-gray-800">
                {p.title}
              </span>
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