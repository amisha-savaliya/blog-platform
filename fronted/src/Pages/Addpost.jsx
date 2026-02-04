import { useState, useEffect } from "react";
import { useCategories } from "../context/Categorycontext";
import { useNavigate } from "react-router-dom";


export default function Addpost({ onAdd, onClose }) {
  const { categories } = useCategories();
  const navigate = useNavigate();
 
const impersonationToken = sessionStorage.getItem("impersonationToken");
  const normalToken = localStorage.getItem("token");
  const token = impersonationToken || normalToken;
useEffect(() => {
  if (!token) navigate("/login");
}, [token, navigate]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
  });

  async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blogimage");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dn2c84jdt/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const res = await fetch("http://localhost:5000/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();

      onAdd(data);
      onClose();
      alert("post added successfully" );
      navigate("/profile");

      setForm({ title: "", content: "", category: "", image: "" });
        alert("post added successfully" );
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.6)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h4>Add New Blog</h4>

          <input
            className="form-control my-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="file"
            className="form-control my-2"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <select
            className="form-select my-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((c,i) => (
              <option key={i} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <textarea
            className="form-control my-2"
            rows="4"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <div className="text-end mt-3">
            <button className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
