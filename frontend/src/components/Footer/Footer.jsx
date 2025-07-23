import './Footer.css'

const Footer = () => {
    return(
        <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                {/* <!-- Quick Links --> */}
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* <!-- Contact Info --> */}
                <div className="footer-column">
                    <h3>Contact Us</h3>
                    <div className="contact-item">
                        <span className="contact-icon">📍</span>
                        <span className="contact-text">Kopargaon, Maharashtra, India</span>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <span className="contact-text">+91 98765 43210</span>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <span className="contact-text">info@saisanchit.com</span>
                    </div>
                </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-bottom">
                <p className="copyright">
                     © 2025 All rights reserved. | Designed by <strong>Space Pirates</strong>
                </p>
                
            </div>
        </div>
    </footer>
    )
}

export default Footer;