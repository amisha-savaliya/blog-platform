import { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editCatData, setEditCatData] = useState(null);
  const [name, setName] = useState("");
  const token = localStorage.getItem("admintoken");

  const loadCategories = () => {
  fetch("http://localhost:5000/category", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      // console.log("CATEGORIES:", data);
      setCategories(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error(err.message);
      setCategories([]);
    });
};


  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = () => {
  if (!name.trim()) return;

  fetch("http://localhost:5000/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Add category failed");
      return res.json();
    })
    .then(() => {
      // console.log("ADDED:", data);
      setName("");
      setShowForm(false);
      loadCategories();   // reload from DB
    })
    .catch((err) => console.error(err.message));
};


  const deleteCategory = (id) => {
    if(!window.confirm("Are you sur eto delete this Category??"))
      return null;
    fetch(`http://localhost:5000/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        setCategories(categories.filter((c) => c.id !== id));
      })
      .catch(console.error);
  };


const editCategory = async () => {
  if (!editCatData?.name.trim()) {
    return alert("Category name is required");
  }

  const res = await fetch(
    `http://localhost:5000/category/${editCatData.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name: editCatData.name }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return alert(data.msg || "Update failed");
  }

  alert("Category updated successfully");

  setShowEdit(false);
  setEditCatData(null);
  loadCategories();
};
  const formattedDate = date =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });


  return (
    // <div className="container py-5 mt-5">
    <div className="max-w-6xl mx-auto px-6 py-10 mt-24 container">

      {/* Header */}
      <div className="flex justify-between items-center  mb-8">
        <h2 className=" heading text-primary fw-bold">Categories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border rounded p-4 bg-blueGray-50">
          <h3 className="font-semibold mb-3 text-text-black-50">Add New Category</h3>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              className="bg-success text-white px-4 py-2 rounded"
              onClick={addCategory}
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* <div className="overflow-x-auto"> */}
      
          <div className=" rounded-xl shadow-md overflow-hidden border">
    <table className="table hover bg-white shadow-sm rounded  w-full border">
      <thead className="text-gray uppercase py-2 fw-semibold justify-content-center text-center">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Category</th>

              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Posts</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className=" py-4  justify-content-center text-center ">
                <td className="border px-4 py-2">{cat.id}</td>
                <td className="border px-4 py-2 font-medium">{cat.name}</td>

                <td className="border px-4 py-2 text-sm">{formattedDate(cat.created_at)}</td>
                <td className="border px-4 py-2 text-sm">{cat.posts || 0}</td>
                <td className="border px-4 py-2 ">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setEditCatData(cat);
                      setShowEdit(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  {"       "}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEdit && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-4 mt-32 justify-center">
              <h4>Edit Category</h4>

              <input
                className="form-control my-3"
                value={editCatData.name}
                onChange={(e) =>
                  setEditCatData({ ...editCatData, name: e.target.value })
                }
              />

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={editCategory}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
