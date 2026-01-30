export default function EditCommentModal({
  show,
  value,
  onChange,
  onClose,
  onSave,
}) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <h5>Edit Comment</h5>

          <textarea
            className="form-control mt-2"
            rows="4"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={onSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
