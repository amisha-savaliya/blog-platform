export default function InquiryModal({ inquiry, onClose }) {
  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📨 Inquiry Details</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p><b>Name:</b> {inquiry.name}</p>
            <p><b>Email:</b> {inquiry.email}</p>
            <p><b>Date:</b> {new Date(inquiry.created_at).toLocaleString()}</p>

            <hr />

            <p><b>Message:</b></p>
            <div className="border rounded p-3 bg-light">
              {inquiry.msg}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}