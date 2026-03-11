import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { selectActiveToken } from "../features/auth/authSlice";

export default function Addpost({ onClose }) {
 
  const navigate = useNavigate();

  const token  = useSelector(selectActiveToken);
  const { categories } =useSelector((s)=>s.category);
  const dispatch = useDispatch();
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
      },
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

       dispatch(
  addPost({
    title: form.title,
    image: imageUrl,
    category: form.category,
    content: form.content,
  })
).unwrap();

alert("Post added successfully");
onClose();        //  correct name
navigate(-1);
    } catch (err) {
      alert(err);
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
            {categories.map((c, i) => (
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
