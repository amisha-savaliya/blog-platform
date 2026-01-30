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
    if (!token) return navigate("/login");
  });

  //cloudniary
  async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blogimage");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dn2c84jdt/image/upload",
      {
        method: "POST",
        body: data,
      },
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
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.6)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h4>Add New Blog</h4>

          <input
            className="form-control my-2"
            placeholder="Title"
            value={form.title || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <input
            type="file"
            className="form-control my-2"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />

          <select
            className="form-select my-2"
            value={form.category || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            className="form-control my-2"
            rows="4"
            placeholder="Content"
            value={form.content || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          <div className="text-end mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handlePost}>
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
