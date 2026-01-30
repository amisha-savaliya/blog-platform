
import React from "react";

export default function AllCommentsModal({
  showModal,
  closeComments,
  comments,
  activePostId,
  formattedDate,
}) {
  if (!showModal) return null; 

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">All Comments ({((comments[activePostId] || []).length)})</h5>
            <button
              className="btn-close"
              onClick={closeComments}
            ></button>
          </div>

          <div className="modal-body">
            {(comments[activePostId] || []).length === 0 ? (
              <p className="text-muted text-center">No comments</p>
            ) : (
              comments[activePostId].map((c) => (
                <div key={c.id} className="border-bottom py-2">
                  <div className="d-flex justify-content-between">
                   <b>{c.user_name}</b>
                   <small className="text-muted">
                    {formattedDate(c.created_at)}
                  </small></div>
                  <div className="mt-1"><p className="mb-1">{c.comment}</p></div>
                  
                </div>
              ))
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={closeComments}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
