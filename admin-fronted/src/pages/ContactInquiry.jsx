import { useEffect, useState } from "react";
import InquiryModal from "../components/inquiry/InquiryModel";
import {useSelector} from 'react-redux';

export default function ContactInquiries() {
  const { token }=useSelector(s=>s.auth);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeInquiry, setActiveInquiry] = useState(null);

  const fetchInquiries = () => {
    setLoading(true);

    fetch(
      `http://localhost:5000/blog/contact?page=${page}&search=${search}`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data.inquiries || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [page, search]);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/blog/contact/${id}/read`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    fetchInquiries();
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;

    await fetch(`http://localhost:5000/blog/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchInquiries();
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📩 Contact Inquiries</h2>

      {/* SEARCH */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search name / email / message"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : inquiries.length === 0 ? (
            <p className="p-4 text-center text-muted">
              No inquiries found
            </p>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th width="180">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((q) => (
                  <tr
                    key={q.id}
                    className={q.is_action === 0 ? "table-warning" : ""}
                  >
                    <td>{q.name}</td>
                    <td>{q.email}</td>
                    <td>
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      {q.is_action === 0 ? (
                        <span className="badge bg-danger">Unread</span>
                      ) : (
                        <span className="badge bg-success">Read</span>
                      )}
                    </td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setActiveInquiry(q)}
                      >
                        View
                      </button>

                      {q.is_action === 0 && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => markAsRead(q.id)}
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteInquiry(q.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center gap-2 mt-4">
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="fw-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* VIEW MODAL */}
      {activeInquiry && (
        <InquiryModal
          inquiry={activeInquiry}
          onClose={() => setActiveInquiry(null)}
        />
      )}
    </div>
  );
}