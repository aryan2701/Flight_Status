import React from "react";
import "./Navbar.css"; // Import CSS for styling

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-brand">
          <a
            href="C:\Users\hp\Downloads\2d062c935dde7754fa80bf011a9dbdc7.jpg"
            className="logo"
          >
            Indigo
          </a>
        </div>
        <ul className="navbar-menu">
          <li>
            <a href="#">Flight Status Updates</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
