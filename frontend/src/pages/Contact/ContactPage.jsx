import "./ContactPage.css";
import ContactCard from "../../components/Contact/ContactCard.jsx";
import { Phone, Mail, Map } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('✅ Thank you for your message! We have received your inquiry and will get back to you within 24 hours.');
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitMessage(result.message || '❌ Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-input">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-input">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="form-input">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject"
                  required
                />
              </div>
              <div className="form-input">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message..."
                  required
                />
              </div>
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
                  {submitMessage}
                </div>
              )}
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;