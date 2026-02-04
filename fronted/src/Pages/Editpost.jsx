import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategories } from "../context/Categorycontext";

export default function EditPost() {
  const { slug } = useParams();
 
const cleanSlug = slug?.replace(/}:$/, "");

  const navigate = useNavigate();
  const { categories } = useCategories();
  const impersonationToken = sessionStorage.getItem("impersonationToken");
   const normaToken = localStorage.getItem("token");
  const token = impersonationToken || normaToken;
  const [form, setForm] = useState(null);
  const [postId, setPostId] = useState(null);
  const [slugPreview, setSlugPreview] = useState("");
  const [loading, setLoading] = useState(false);
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/}:$/, "");
}


 useEffect(() => {
  if (!slug) return; 

  fetch(`http://localhost:5000/posts/slug/${cleanSlug}`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      setForm({
          ...data,
          category: Number(data.category_id || data.category),
        });
      setPostId(data.id);
      setSlugPreview(data.slug);
    })
    .catch(console.error);
}, [slug]);


  async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blogimage");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dn2c84jdt/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
  }

 const handleUpdate = async () => {
  setLoading(true);

  let imageUrl = form.image;
  if (form.image instanceof File) {
    imageUrl = await uploadImage(form.image);
  }

  if(!form.category)
    return alert("please select Category ")

  const res = await fetch(
    `http://localhost:5000/posts/update/${postId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        ...form,
        image: imageUrl,
        slug: slugPreview
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Update failed");
    setLoading(false);
    return;
  }

  alert("Post updated successfully");
  navigate("/profile", { replace: true });
};


  if (!form) return <div className="container mt-5">Loading...</div>;

  const selectedCategory = categories.find(
  c => Number(c.id) === Number(form.category)
);


  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3>Edit Post</h3>

        <input
          className="form-control my-2"
          value={form.title}
          onChange={e => {
            const value = e.target.value;
            setForm({ ...form, title: value });
            setSlugPreview(slugify(value));
          }}
        />

        <small className="text-muted mb-2">
          Slug: <strong>{slugPreview}</strong>
        </small>

        <input
          type="file"
          className="form-control my-2"
          onChange={e => setForm({ ...form, image: e.target.files[0] })}
        />
        {form.image && (
  <img
    src={form.image}
    style={{height:"300px" , width:"500px"}}
    alt="Post"
    className="img-fluid mb-2"
  />
)}


        <select
          className="form-select my-2"
          value={form.category}
          required
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
           <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <small className="text-muted mb-2">
  Select category : <strong>{selectedCategory?.name || "None"}</strong>
</small>


        <textarea
          className="form-control my-2"
          rows="5"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary mt-3"
            disabled={loading}
            onClick={handleUpdate}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            className="btn btn-danger mt-3"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
