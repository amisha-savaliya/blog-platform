

export default function Footer() {



  return (
    <footer className="site-footer bg-dark py-4 mt-5 border-top ">
      <div className="container">
        <div className="row align-items-center text-center  text-md-start">

          {/* Left: Copyright */}
          <div className="col-md-6 mb-3 mb-md-0 text-center">
           <p className="fw-light mb-0">
  © {new Date().getFullYear()} BlogNest. All rights reserved.
</p>

          </div> 




          {/* Right: Social Icons */}
          <div className="col-md-6">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3">
              <a href="https://www.instagram.com" className="text-white fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.twitter.com" className="text-white fs-4">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://www.facebook.com" className="text-white fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.linkedin.com" className="text-white fs-4">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://www.github.com" className="text-white fs-4">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}



