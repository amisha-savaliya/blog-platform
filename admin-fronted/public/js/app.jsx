import Navbar from "./Navbar";

function App() {
  return (
    <>
      <Navbar />

      {/* Your original desktop menu */}
      <nav className="js-clone-nav">
        <ul>
          <li className="has-children">
            <a href="#">Services</a>
            <ul className="dropdown">
              <li><a href="#">Web</a></li>
              <li><a href="#">Mobile</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default App;
