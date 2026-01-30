import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useCategories } from "../../../context/Categorycontext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostChart() {
  const [posts, setPosts] = useState([]);
  const { categories } = useCategories();
  const token = localStorage.getItem("admintoken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/admin/login");

    fetch("http://localhost:5000/posts/get", {
      method:"POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(console.error);
  }, [token, navigate]);   

  // Extract category names
  const labels = categories.map(cat => cat.name);

  // Count posts for each category
  const postCounts = categories.map(c =>
    posts.filter(post => post.category === c.name).length
  );
  const totalPosts=posts.length;

  const data = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: postCounts,
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  return (
     <div className="card shadow-lg p-4 mt-4 rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">Posts by Category</h4>
        <span className="badge bg-primary fs-6">
          Total Posts: {totalPosts}
        </span>
      </div>
      <Bar data={data} />
    </div>
  );
}
