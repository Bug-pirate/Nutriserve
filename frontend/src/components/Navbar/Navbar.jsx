import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import chef from "../../assets/chef.png";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleAuthClick = () => {
    if (isLoginPage) navigate("/signup");
    else if (isSignUpPage) navigate("/login");
    else navigate("/login");
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
    setProfileDropdownOpen(false);
    setMenuOpen(false); // Close mobile menu when navigating
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMenuOpen(false); // Close mobile menu when logging out
  };

  const handleMobileAuthClick = () => {
    handleAuthClick();
    setMenuOpen(false); // Close mobile menu when navigating to login
  };

  const handleNavLinkClick = (path) => {
    navigate(path);
    setMenuOpen(false); // Close mobile menu when clicking nav links
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
          <p><a href="/" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/'); }}>Home</a></p>
          <p><a href="/about" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/about'); }}>About</a></p>
          <p><a href="/contact" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/contact'); }}>Contact</a></p>
          
          {/* Mobile Authentication Controls */}
          {isAuthenticated() ? (
            <div className="mobile-profile">
              <p className="mobile-profile-item" onClick={handleDashboardClick}>
                <i className="fas fa-tachometer-alt"></i>
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </p>
              <p className="mobile-profile-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </p>
            </div>
          ) : (
            <p className="mobile-login-btn" onClick={handleMobileAuthClick}>
              <i className="fas fa-sign-in-alt"></i>
              {getButtonLabel()}
            </p>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated() ? (
            <div className="profile-container">
              <i
                className="fas fa-user-circle profile-icon"
                title="Profile"
                onClick={handleProfileClick}
              ></i>
              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-item" onClick={handleDashboardClick}>
                    <i className="fas fa-tachometer-alt"></i>
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </div>
                </div>
              )}
            </div>
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
