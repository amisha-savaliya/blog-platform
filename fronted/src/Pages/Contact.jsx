import React, { useState} from "react";
import { useEffect } from "react";
import { jsx } from "react/jsx-runtime";

export default function Contact() {
  const [settings,setSetting]=useState([]);
  


  useEffect(()=>
  {
    fetch("http://localhost:5000/settings")
    .then((res)=>res.json())
    .then(data=>{setSetting(data)})
  },[])
    const [details,setDetails]=useState({

        name:"",
        email:"",
        msg:"",
    })
    function handlemsg(e)
    {
        e.preventDefault();


        fetch(`http://localhost:5000/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(details)
      })
      .then(res=>res.json())
      .then(()=>
        {
          // console.log(data);
        alert("inquiry added");
        setDetails({name:"",email:"",msg:""})
        }
    ).catch(console.error)
    }
  return (
    <>
      <div className="container py-5">
      
        <div
          className="mb-5 rounded overflow-hidden"
          style={{
            backgroundImage:
              "url('../../images/contact.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "280px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
            }}
          />
          <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white position-relative text-center">
            <h1 className="fw-bold display-4">Contact Us</h1>
            <p className="fs-5 opacity-75">We’d love to hear from you</p>
            <small className="opacity-75">HOME / CONTACT</small>
          </div>
        </div>

        {/* Contact Section */}
        <div className="row g-4">
          {/* Info */}
          <div className="col-md-5">
            <div className="bg-white p-4 rounded shadow h-100">
              <h3 className="fw-bold mb-3">Get In Touch</h3>
              <p className="text-muted">
                Have a question, feedback, or idea? Send us a message and we’ll
                respond as soon as possible.
              </p>

              <p className="mb-1">
               <strong><i className="fa-solid fa-envelope"></i></strong> {settings?.admin_email}
                {/* <strong>Email:</strong> support@myblog.com */}
              </p>
              <p className="mb-1">
                <strong><i className="fa fa-phone"></i></strong>  {settings?.contact}
                {/* +91 9998887776 */}
              </p>
              <p className="mb-1">
                <strong><i className="fa-solid fa-location-dot"></i> </strong>  {settings?.address}
                
                 {/* India */}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="col-md-7">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="fw-bold mb-3">Send Message</h3>

              <form onSubmit={handlemsg}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={details.name}
                    className="form-control"
                    placeholder="Your name"
                    onChange={(e)=>setDetails({...details, name:e.target.value})}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="text"
                    value={details.email}
                    className="form-control"
                    placeholder="Your email"
                    onChange={(e)=>setDetails({...details,email:e.target.value})}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={details.msg}
                    placeholder="Your message"
                    onChange={(e)=>setDetails({...details,msg:e.target.value})}
                  ></textarea>
                </div>

                <button className="btn btn-primary btn-lg w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}
