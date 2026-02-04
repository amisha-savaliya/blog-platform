import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../../context/Categorycontext";

export default function PostChart() {
  const [chartStats, setChartStats] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [range, setRange] = useState("all"); // 7 | 30 | all
  const token = localStorage.getItem("admintoken");
  const { categories } =useCategories();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/admin/login");

    fetch(`http://localhost:5000/posts/get?range=${range}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setChartStats(data.chartStats || []);
        setTotalPosts(data.posts?.length || 0);
      })
      .catch(console.error);
  }, [range, token, navigate]);

  const labels = categories.map(c => c.name);

const counts = categories.map(cat => {
  const found = chartStats.find(s => s.name === cat.name);
  return found ? found.total : 0; // zero if no posts
});


  const chartData = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: counts,
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  return (
    <div className="card shadow-lg p-4 mt-4 rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">Posts by Category</h4>

        <div className="flex gap-2">
          <button onClick={() => setRange("7")} className="btn btn-sm btn-outline-primary">7 Days</button>
          <button onClick={() => setRange("30")} className="btn btn-sm btn-outline-primary">30 Days</button>
          <button onClick={() => setRange("all")} className="btn btn-sm btn-outline-primary">All</button>
        </div>
        
      </div>
      <span className="badge bg-primary fs-6 mb-2 me-0 w-25">
        Total Posts: {totalPosts}
      </span>

      

      <Bar data={chartData} />
    </div>
  );
}
