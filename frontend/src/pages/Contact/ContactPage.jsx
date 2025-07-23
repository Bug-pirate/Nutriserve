import "./ContactPage.css";
import ContactCard from "../../components/Contact/ContactCard.jsx";
import { Phone, Mail, Map } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <div className="contact-container">
          <div className="contact-description">
            <h2>Contact Us</h2>
            <p>
              We'd love to hear from you. Reach out and we'll get back to you as
              soon as possible.
            </p>
          </div>
          <div className="contact-cards">
            <ContactCard 
              icon={Phone} 
              title="Phone" 
              value="+1 (555) 123-4567" 
            />
            <ContactCard 
              icon={Mail} 
              title="Email" 
              value="contact@company.com" 
            />
            <ContactCard
              icon={Map}
              title="Address"
              value="123 Business Ave Suite 100, City, State 12345"
            />
          </div>
        </div>

        <div className="form-wrapper">
          <div className="form-box">
            <div className="form-text">
              <h2>Send Message</h2>
              <p>Fill out the form below and we'll get back to you shortly.</p>
            </div>
            <form className="contact-form">
              <div className="form-input">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-input">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="form-input">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject"
                  placeholder="Enter subject"
                />
              </div>
              <div className="form-input">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  placeholder="Enter your message..."
                />
              </div>
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;