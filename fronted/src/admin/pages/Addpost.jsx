import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../context/Categorycontext";

export default function Addpost() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const token = localStorage.getItem("admintoken");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    image: "",
    category: "",
    content: "",
  });

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blogimage");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dn2c84jdt/image/upload",
      { method: "POST", body: data },
    );

    const result = await res.json();
    return result.secure_url;
  }

  async function handlePost() {
    if (!form.title || !form.image || !form.category || !form.content) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage(form.image);

      await fetch("http://localhost:5000/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
        }),
      });

      alert("Post published successfully 🚀");
      navigate("/admin/posts");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-3 py-5" style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div className="bg-white p-4 shadow-sm rounded mb-4">
        <h2 className="fw-bold text-primary-emphasis m-0">
          <i className="fa-solid fa-pen-to-square me-2"></i>
          Create New Post
        </h2>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          {/* Title */}
          <label className="form-label fw-semibold">Post Title</label>
          <input
            className="form-control mb-2"
            placeholder="Enter post title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          {form.title && (
            <small className="text-muted">
              Slug: <b>{slugify(form.title)}</b>
            </small>
          )}

          {/* Image Upload */}
          <label className="form-label fw-semibold mt-3">Featured Image</label>
          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />

          {form.image && (
            <div className="mb-3">
              <img
                src={URL.createObjectURL(form.image)}
                alt="preview"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "260px", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Category */}
          <label className="form-label fw-semibold">Category</label>
          <select
            className="form-select mb-3"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Content */}
          <label className="form-label fw-semibold">Post Content</label>
          <textarea
            className="form-control mb-3"
            rows="7"
            placeholder="Write your content here..."
            value={form.content}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/posts")}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary px-4"
              onClick={handlePost}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
