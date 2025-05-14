import "./navbar.scss";

const Navbar = () => {
  return (
    <header className="praid-vlm-header">
      <nav className="praid-vlm-nav">
        <figure className="praid-logo-wrapper">
          <img className="navbar-logo" src="/praid-logo.png" />

          <figcaption className="navbar-logo-caption">
            VLM Radiology Assitant
          </figcaption>
        </figure>

        <section className="navbar-content-wrapper">
          <p className="content">Powered by Visual Language Model</p>
        </section>
      </nav>
    </header>
  );
};

export default Navbar;
