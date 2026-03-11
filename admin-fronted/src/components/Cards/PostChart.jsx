import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function PostChart({
  chartData = { labels: [], datasets: [] },
  totalPosts = 0,
  range,
  setRange,
}) {
  return (
    <div className="card shadow-lg p-4 mt-4 rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">Posts by Category</h4>

        <div className="d-flex gap-2">
          <button
            onClick={() => setRange("7")}
            className="btn btn-sm btn-outline-primary"
          >
            7 Days
          </button>
          <button
            onClick={() => setRange("30")}
            className="btn btn-sm btn-outline-primary"
          >
            30 Days
          </button>
          <button
            onClick={() => setRange("all")}
            className="btn btn-sm btn-outline-primary"
          >
            All
          </button>
        </div>
      </div>

      <span className="badge bg-primary fs-6 mb-2 w-25">
        Total Posts: {totalPosts}
      </span>

      {chartData?.datasets?.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p className="text-muted">No data available</p>
      )}
    </div>
  );
}
