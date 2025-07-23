import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import chef from "../../assets/chef.png";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";

  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (isLoginPage) navigate("/signup");
    else if (isSignUpPage) navigate("/login");
    else navigate("/login");
  };

  const getButtonLabel = () => {
    if (isLoginPage) return "Sign Up";
    if (isSignUpPage) return "Login";
    return "Login";
  };

  return (
    <div className="navbar-container">
      <div className="navbar-fields">
        <div className="navbar-logo">
          <img src={chef} alt="Logo" />
        </div>

        {/* Hamburger Icon */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </div>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? "show-menu" : ""}`}>
          <p><a href="/">Home</a></p>
          <p><a href="/about">About</a></p>
          <p><a href="/contact">Contact</a></p>
          <p className="login-link-btn"><a href="/login">Login</a></p>
        </div>

        <div className="navbar-auth">
          {isLoggedIn ? (
            <i
              className="fas fa-user-circle profile-icon"
              title="Profile"
              onClick={() => setIsLoggedIn(false)}
            ></i>
          ) : (
            <button className="login-btn" onClick={handleAuthClick}>
              {getButtonLabel()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
