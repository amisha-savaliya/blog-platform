import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux"
import { fetchAllCategory } from "../Redux/features/category/categorySlice";
import { updatePost } from "../Redux/features/posts/postsSlice";


export default function EditPost() {
  const { slug } = useParams();
  const cleanSlug = slug?.replace(/}$/, "");

  const navigate = useNavigate();
  const {categories }=useSelector(s=>s.category);
  const  {token }=useSelector((s)=>s.auth);
  const dispatch=useDispatch(); 

  const [form, setForm] = useState(null);
  const [postId, setPostId] = useState(null);
  const [slugPreview, setSlugPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /* ---------------- FETCH POST ---------------- */
  useEffect(() => {
    if (!cleanSlug || !token) return;

    fetch(`http://localhost:5000/blog/posts/slug/${cleanSlug}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ ...data, category_id: Number(data.category_id) });
        setPostId(data.id);
        setSlugPreview(data.slug);
        setImagePreview(data.image);
      })
      .catch(console.error);
  }, [cleanSlug, token]);




 

  /* ---------------- IMAGE UPLOAD ---------------- */
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

  /* ---------------- UPDATE POST ---------------- */
  const handleUpdate = async () => {
    try {
      setLoading(true);

      let imageUrl = imagePreview;
      if (form.image instanceof File) {
        imageUrl = await uploadImage(form.image);
      } 
      
      const updated=await dispatch(
            updatePost({
              postId,
              updatedData: {
                title:form.title,
                content:form.content,
                category:form.category_id,
                image: imageUrl,
                slug: slugPreview,
              },
            })
          ).unwrap();
   

      alert("Post updated successfully!");
      navigate(`/posts`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="container mt-5">Loading...</div>;

  const selectedCategory = categories.find(
    (c) => Number(c.id) === Number(form.category_id)
  );

  return (
    <div className="container mt-4 py-4">
      <div className="card p-4 shadow rounded-4">
        <div className="d-flex justify-content-between mb-3">
          <h3 className="fw-bold fs-4 text-primary">Edit Post</h3>
          <button className="btn btn-light border" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <input
          className="form-control my-2"
          value={form.title}
          onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, title: value });
            setSlugPreview(slugify(value));
          }}
        />

        <small className="text-muted">Slug: {slugPreview}</small>

        <input
          type="file"
          className="form-control my-2"
          onChange={(e) => {
            const file = e.target.files[0];
            setForm({ ...form, image: file });
            setImagePreview(URL.createObjectURL(file));
          }}
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="img-fluid rounded mb-2"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
        )}

        <select
          className="form-select my-2"
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: Number(e.target.value) })
          }
        >
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <small className="text-muted">
          Current category: {selectedCategory?.name || "None"}
        </small>

        <textarea
          className="form-control my-2"
          rows="5"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleUpdate}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button className="btn btn-danger" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
