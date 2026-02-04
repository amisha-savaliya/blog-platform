import React from "react";
import "/css/style.css";

export default function About() {
  return (
    <>
    <div className="container mt-4">
          {/* HERO SECTION */}
      <div
        className="site-cover site-cover-sm same-height overlay single-page"
        style={{ backgroundImage: "url('/images/about_header.jpeg')" }}
      >
        <div className="container">
          <div className="row same-height justify-content-center">
            <div className="col-md-6">
              <div className="post-entry text-center">
                <h1 className="mb-4">About Blog Platform</h1>
                <p className="text-white">
                  A modern content management system built for creators,
                  writers, and growing communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
     <div className="section sec-halfs py-5 mt-5">

        <div className="container">
          {[
            {
              img: "/about_2.jpeg",
              title: "Empowering Writers & Creators",
              desc: "Our platform helps bloggers and content creators turn their ideas into engaging stories. With powerful publishing tools and a clean interface, managing your content has never been easier.",
            },
            {
              img: "/about_1.png",
              title: "Trusted by a Growing Community",
              desc: "Thousands of users rely on our system to organize content, connect with readers, and build their digital presence with confidence.",
              reverse: true,
            },

            {
              img: "/about_3.jpg",
              title: "why choose us?",
              desc: "We prioritize creativity, simplicity, and security in everything we build. Our mission is to provide a reliable platform that empowers creators to share their stories with the world.",
              reverse: false,
            },
          ].map((item, i) => (
            <div key={i} className="half-content d-lg-flex align-items-stretch">
              <div
                className={`img ${item.reverse ? "order-md-2" : ""}`}
                style={{ backgroundImage: `url('/images/${item.img}')` }}
              ></div>

              <div className="text">
                <h2 className="heading text-primary mb-3">{item.title}</h2>
                <p className="mb-4">{item.desc}</p>
                <p></p>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="row text-center mt-3 mb-0">
        <div className="col-md-4 mb-3">
          <div className="p-4 border rounded shadow-sm h-100">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <i className="bi-rocket-takeoff-fill text-primary fs-1"></i>

              <h2 className="fw-bold text-primary mb-0">Our Mission</h2>
            </div>
            <p className="text-muted mt-3">
              To empower writers and creators by providing a fast, simple, and
              reliable blogging platform that helps them share their ideas with
              the world.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="p-4 border rounded shadow-sm h-100">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <i className="bi-eye-fill text-success fs-1"></i>
              <h2 className="fw-bold text-success mb-0">Our Vision</h2>
            </div>
            <p className="text-muted mt-3">
              To build the most trusted, community-driven blogging platform for
              sharing knowledge, creativity, and inspiration worldwide.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="p-4 border rounded shadow-sm h-100">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <i className="bi-heart-fill text-warning fs-1"></i>
              <h2 className="fw-bold text-warning mb-0">Our Values</h2>
            </div>
            <p className="text-muted mt-3">
              Creativity, simplicity, security, transparency, and continuous
              growth in everything we build.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
