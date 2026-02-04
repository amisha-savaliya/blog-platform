import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../context/Categorycontext";

export default function Addpost() {
  const navigate = useNavigate();

  const initialForm = {
    title: "",
    image: "",
    category: "",
    content: "",
  };

  const [form, setForm] = useState(initialForm);
  const { categories } = useCategories();

  const token = localStorage.getItem("admintoken");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]); // ⚠️ important

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
      const imageUrl = await uploadImage(form.image);

      const blogData = {
        title: form.title,
        image: imageUrl,
        category: form.category,
        content: form.content,
      };

      await fetch("http://localhost:5000/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(blogData),
      });

      alert("Blog added successfully!");
      navigate("/admin/posts");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="mb-4 fw-bold">Create New Post</h3>

          <input
            className="form-control mb-3"
            placeholder="Post Title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              alt="preview"
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "250px", objectFit: "cover" }}
            />
          )}

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

          <textarea
            className="form-control mb-3"
            rows="6"
            placeholder="Write your content here..."
            value={form.content}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/posts")}
            >
              Cancel
            </button>
            <button className="btn btn-primary px-4" onClick={handlePost}>
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
