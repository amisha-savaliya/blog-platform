import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, deleteCategory, fetchAllCategory, updateCategory } from "../Redux/features/category/categorySlice";

export default function Categories() {
  const { categories } = useSelector((s) => s.category);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editCatData, setEditCatData] = useState(null);
  const [name, setName] = useState("");
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!token)
      return;
    dispatch(fetchAllCategory());
  }, [token,dispatch]);

  const handleAddCategory = () => {
    if (!name.trim()) return;
    try {
      dispatch(addCategory({name}))
      .unwrap();
      alert("category added successfully");
      setName("");
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sur eto delete this Category??")) return null;
    
    dispatch(deleteCategory(id));
  }


  const editCategory = async () => {
    if (!editCatData?.name.trim()) {
      return alert("Category name is required");
    }
    dispatch(updateCategory({editId:editCatData.id,
      editName:editCatData.name,
    })).unwrap();


    alert("Category updated successfully");

    setShowEdit(false);
    setEditCatData(null);
  };
  const formattedDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  return (
    // <div className="container py-5 mt-5">
    <div className="max-w-6xl mx-auto px-6 py-10 ">
      {/* Header */}
      <div className=" shadow-sm rounded mb-4 d-flex justify-content-between align-items-center flex-wrap">
        <h2 className="heading text-primary-emphasis fw-bold fs-2 mb-3">
          <i className="fa-solid fa-layer-group me-2"></i>
          Manage Categories
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border rounded p-4 bg-blueGray-50">
          <h3 className="font-semibold mb-3 text-text-black-50">
            Add New Category
          </h3>

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
              onClick={handleAddCategory}
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

      <div className=" rounded-xl shadow-md overflow-hidden border bg-white ">
        <table className="table table-hover shadow-sm rounded  w-full border">
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
              <tr
                key={cat.id}
                className=" py-4  justify-content-center text-center "
              >
                <td className="border px-4 py-2">{cat.id}</td>
                <td className="border px-4 py-2 font-medium">{cat.name}</td>

                <td className="border px-4 py-2 text-sm">
                  {formattedDate(cat.created_at)}
                </td>
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
                    onClick={() => handleDeleteCategory(cat.id)}
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
        <div
          className="modal d-block py-5 align-content-center"
          style={{ background: "rgba(0,0,0,.6)" }}
        >
          <div className="modal-dialog justify-center">
            <div className="modal-content p-4  justify-center">
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
