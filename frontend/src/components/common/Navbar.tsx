import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header>
      <img src={logo} alt="HISS US Logo" className="logo" />
      <nav>
        <ul>
          <li><a href="#products">Products</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#values">Our Values</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
