export default function HeroPosts() {
  return (
    <section className="section bg-light">
      <div className="container">
        <div className="row align-items-stretch retro-layout">

          <div className="col-md-4">
            <a className="h-entry mb-30 v-height gradient">
              <div className="featured-img" style={{ backgroundImage: "url(images/img_2_horizontal.jpg)" }}></div>
              <div className="text">
                <span className="date">Apr. 14th, 2022</span>
                <h2>AI can now kill those annoying cookie pop-ups</h2>
              </div>
            </a>
          </div>

          <div className="col-md-4">
            <a className="h-entry img-5 h-100 gradient">
              <div className="featured-img" style={{ backgroundImage: "url(images/img_1_vertical.jpg)" }}></div>
              <div className="text">
                <span className="date">Apr. 14th, 2022</span>
                <h2>Why is my internet so slow?</h2>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
