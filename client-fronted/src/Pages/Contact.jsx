import React, { useState, useEffect } from "react";

export default function Contact() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [details, setDetails] = useState({
    name: "",
    email: "",
    msg: "",
  });

  // Fetch settings
  useEffect(() => {
    fetch("http://localhost:5000/blog/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleMsg = async (e) => {
    e.preventDefault();

    if (!details.name || !details.email || !details.msg) {
      return alert("Please fill all fields");
    }

    try {
      setSending(true);

      const res = await fetch("http://localhost:5000/blog/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Inquiry sent successfully!");
      setDetails({ name: "", email: "", msg: "" });
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5">
      {/* HERO */}
      <div
        className="mb-5 rounded overflow-hidden position-relative"
        style={{
          backgroundImage: "url('/images/contact.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "280px",
        }}
      >
        <div className="overlay-dark" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", }} />
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white position-relative text-center">
          <h1 className="fw-bold display-5">Contact Us</h1>
          <p className="fs-5 opacity-75">We’d love to hear from you</p>
        </div>
      </div>

      <div className="row g-4">
        {/* INFO */}
        <div className="col-md-5">
          <div className="bg-white p-4 rounded shadow h-100">
            <h3 className="fw-bold mb-3">Get In Touch</h3>

            {loading ? (
              <p>Loading contact info...</p>
            ) : (
              <>
                <p><i className="fa-solid fa-envelope me-2 text-primary"></i>{settings.admin_email}</p>
                <p><i className="fa fa-phone me-2 text-success"></i>{settings.contact}</p>
                <p><i className="fa-solid fa-location-dot me-2 text-danger"></i>{settings.address}</p>
              </>
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="col-md-7">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="fw-bold mb-3">Send Message</h3>

            <form onSubmit={handleMsg}>
              <input
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Your name"
              />

              <input
                type="email"
                name="email"
                value={details.email}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Your email"
              />

              <textarea
                name="msg"
                rows="4"
                value={details.msg}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Your message"
              />

              <button
                className="btn btn-primary w-100"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
