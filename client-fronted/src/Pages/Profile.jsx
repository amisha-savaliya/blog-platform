import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Addpost from "./Addpost";
import CommentsModal from "../components/CommentModel";

import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  fetchMyPosts,
  likePost,
} from "../features/posts/postsSlice";

import {
  logout,
  stopImpersonation,
  selectActiveUser,
  selectActiveToken,
} from "../features/auth/authSlice";
import { fetchAllCategory } from "../features/category/categorySlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeUser = useSelector(selectActiveUser);
  const activeToken = useSelector(selectActiveToken);
  const { isImpersonating } = useSelector((state) => state.auth);
  const { categories }=useSelector((state)=>state.category);

  const { myPosts, loading } = useSelector((s) => s.posts);

  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  /* ================= LOAD POSTS ================= */
  useEffect(() => {
    if (!activeToken) {
      navigate("/login");
      return;
    }

    dispatch(fetchMyPosts());
  }, [activeToken, dispatch, navigate]);
  useEffect(()=>
  {
    dispatch(fetchAllCategory())
  },[dispatch])

  /* ================= FORMAT DATE ================= */
  const formatteddate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ================= DELETE ================= */
  const handleDelete = (slug) => {
    if (!window.confirm("Are you sure to Delete Post?")) return;
    dispatch(deletePost(slug));
  };

  /* ================= STOP IMPERSONATION ================= */
  const exitImpersonation = () => {
    dispatch(stopImpersonation());
    window.close();
  };
  const closeComments=()=>
  {
    setActivePostId(null);
    setShowModal(false);

  };

  if (!activeUser || loading)
    return <div className="container mt-5">Loading...</div>;

//   return (
//     <div className="container mt-5">
//       {isImpersonating && (
//         <div className="alert alert-danger d-flex justify-content-between align-items-center">
//           <div>⚠ Admin is impersonating this user account</div>
//           <button
//             className="btn btn-sm btn-light"
//             onClick={exitImpersonation}
//           >
//             End Session
//           </button>
//         </div>
//       )}

//       {/* PROFILE CARD */}
//       <div className="card shadow p-4 mb-4">
//         <div className="d-flex align-items-center gap-4 mb-1">
//           <img
//             src="/user.png"
//             className="rounded-circle"
//             width="100"
//             height="100"
//             alt="user"
//           />
//           <div>
//             <h3>{activeUser.name}</h3>
//             <p className="text-muted fw-semibold mb-1">
//               {activeUser.email}
//             </p>
//             <small className="text-muted">
//               Joined : {formatteddate(activeUser.created_at)}
//             </small>
//           </div>
//         </div>

//         <div className="mt-4 d-flex gap-2">
//           <button
//             className="btn btn-outline-primary fw-semibold"
//             onClick={() => navigate("/edit-profile")}
//           >
//             Edit Profile
//           </button>

//           <button
//             className="btn btn-outline-danger fw-semibold"
//             onClick={() => {
//               dispatch(logout());
//               navigate("/login");
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* POSTS */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4>My Posts</h4>
//         <button
//           className="btn btn-success"
//           onClick={() => setShowForm(true)}
//         >
//           + Add Post
//         </button>
//       </div>

//       {myPosts.length === 0 && (
//         <p className="text-muted">
//           You haven't written any posts yet.
//         </p>
//       )}

//       <div className="row g-3">
//         {myPosts.map((p) => (
//           <div className="col-md-4" key={p.id}>
//             <div className="card h-100 shadow-sm">
//               <img
//                 src={p.image || "/placeholder.jpg"}
//                 className="card-img-top"
//                 style={{ height: "250px" }}
//                 alt="post"
//               />

//               <div className="card-body">
//                 <h5>{p.title}</h5>

//                 <span className="text-muted">
//                   {formatteddate(p.created_at)} <br />
//                   {p.category} • By - {p.author}
//                 </span>

//                 <p>{p.content?.slice(0, 80)}...</p>

//                 <div className="d-flex gap-2 mb-2">
//                   <button
//                     className="btn btn-outline-primary"
//                     onClick={() =>
//                       navigate(`/post/${p.slug}`)
//                     }
//                   >
//                     Read More →
//                   </button>

//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() =>
//                       navigate(`/edit-post/${p.slug}`)
//                     }
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() =>
//                       handleDelete(p.slug)
//                     }
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>

//               <div className="card-footer d-flex justify-content-between">
//                 <button
//                   className="btn btn-link p-2 fs-6"
//                   onClick={() =>
//                     dispatch(likePost(p.id))
//                   }
//                 >
//                   {p.userLiked ? "❤️" : "🤍"}{" "}
//                   {p.totalLikes ?? 0}
//                 </button>

//                 <button
//                   className="btn btn-link p-2 fs-6"
//                   onClick={() => {
//                     setActivePostId(p.id);
//                     setShowModal(true);
//                   }}
//                 >
//                   💬 {p.commentCount ?? 0}
//                 </button>

//                 <span className="p-2">
//                   👁 {p.views ?? 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showForm && (
//         <Addpost onClose={() => setShowForm(false)} />
//       )}

//       <CommentsModal
//         postId={activePostId}
//         token={activeToken}
//         user={activeUser}
//         show={showModal}
//         onClose={() => setShowModal(false)}
//       />
//     </div>
//   );
// }
  return (
    <div className="container mt-5">
      {isImpersonating && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>⚠ Admin is impersonating this user account</div>
          <button
            className="btn btn-sm btn-light"
            onClick={() => {
              exitImpersonation();
              navigate("/users");
              
            }}
          >
            End Session
          </button>
        </div>
      )}

      <div className="card shadow p-4 mb-4 h-100">
        <div className="d-flex align-items-center gap-4 mb-1">
          <img
            src="/user.png"
            className="rounded-circle"
            width="100"
            height="100"
            alt="user"
          />
          <div>
            <h3>{activeUser.name}</h3>
            <p className="text-muted fw-semibold mb-1">{activeUser.email}</p>
            <small className="text-muted">
              Joined :{formatteddate(activeUser.created_at)}
            </small>
          </div>
        </div>
        <br />
        <div className="mt-4 d-flex gap-1">
          <p
            className="btn btn-outline-primary fw-semibold"
            onClick={() => navigate("/edit-profile")}
          >
            <i className="bi bi-pencil"></i> Edit Profile
          </p>

          <p
            className="btn btn-outline-danger fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            <i className="bi bi-trash"></i> Logout
          </p>
        </div>
      </div>

      {/* MY POSTS */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Posts</h4>

        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          + Add Post
        </button>
      </div>
      {myPosts.length === 0 && (
        <p className="text-muted">You haven't written any posts yet.</p>
      )}

      <div className="row g-3">
        {myPosts.map((p) => {
          return (
            <div className="col-md-4" key={p.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={p.image || "/placeholder.jpg"}
                  className="card-img-top"
                  style={{ height: "250px" }}
                />
                <div className="card-body">
                  <h5>{p.title}</h5>
                  <span className="date text-muted">
                    {formatteddate(p.created_at)}
                    <br />
                    <a href="#">{p.category}</a> • By - {p.author} <br />
                  </span>
                  <p>{p.content?.slice(0, 80)}...</p>
                  <div className=" d-flex-md  gap-3sm mb-2 align-items-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/post/${p.slug}`)}
                    >
                      Read More →
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/edit-post/${p.slug}`)}
                    >
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.slug)}
                    >
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className={
                      p.userLiked
                        ? "btn btn-link text-danger p-2 fs-6"
                        : "btn btn-link text-muted p-2 fs-6"
                    }
                    onClick={() => dispatch(likePost(p.id))}
                  >
                    {p.userLiked ? "❤️" : "🤍"} {p.totalLikes ?? 0}
                  </button>

                  <button
                    className="btn btn-link text-muted p-2 fs-6"
                    onClick={() => {
                      setActivePostId(p.id);
                      setShowModal(true);
                    }}
                  >
                    <i className="fa-regular fa-comment"></i>{" "}
                    {p.commentCount ?? 0}
                  </button>

                  <span className="text-muted p-2">
                    <i className="fa-solid fa-eye "></i> {p.views ?? 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && <Addpost onClose={() => setShowForm(false)} />}
      <CommentsModal
        postId={activePostId}
        token={activeToken}
        user={activeUser}
        show={showModal}
        onClose={closeComments}
      />
    </div>
  );
}
