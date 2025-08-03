import heroimg from "../../assets/hero5.png";
import "./HomePage.css";
import Footer from "../../components/Footer/Footer.jsx";
import FeatureCard from "../../components/FeatureCard/FeatureCard.jsx";
import { Utensils } from "lucide-react";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Utensils size={16} style={{ marginRight: '8px', color: '#f97316' }} />
              <span>Fresh & Healthy</span>
            </div>
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">SaiSanchit</span>
              <br />
              Tiffin Services
            </h1>
            <p className="hero-subtitle">
              We deliver healthy, delicious food right to your doorstep
            </p>

            <div className="hero-button">
              <button className="btn-primary">
                <span>Order Now</span>
                <i className="arrow-icon">→</i>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Meals Delivered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Customer Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-wrapper">
              <img src={heroimg} alt="Delicious healthy food" />
              <div className="floating-card card-1">
                <span className="emoji">🥗</span>
                <span>Fresh Salads</span>
              </div>
              <div className="floating-card card-2">
                <span className="emoji">🍛</span>
                <span>Hot Meals</span>
              </div>
              <div className="floating-card card-3">
                <span className="emoji">⏰</span>
                <span>On Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose SaiSanchit?</h2>
            <p>
              Experience the best tiffin service in Kopargaon with our premium
              features
            </p>
          </div>
          <div className="features-grid">
            <FeatureCard
              icon="🏠"
              title="Homemade Quality"
              description="Every meal is prepared with love and care, just like home-cooked food"
            />
            <FeatureCard
              icon="🚚"
              title="Fast Delivery"
              description="Hot and fresh meals delivered to your doorstep within 30 minutes"
            />
            <FeatureCard
              icon="🥬"
              title="Fresh Ingredients"
              description="We use only the freshest, locally-sourced ingredients for all our dishes"
            />
            <FeatureCard
              icon="💰"
              title="Affordable Prices"
              description="Enjoy delicious, healthy meals at prices that won't break the bank"
            />
            <FeatureCard
              icon="👨‍🍳"
              title="Experienced Chefs"
              description="Our skilled chefs bring years of culinary expertise to ensure every bite is flavorful and satisfying"
            />
            <FeatureCard
              icon="📦"
              title="Eco-Friendly Packaging"
              description="We care for the planet—your meals are delivered in biodegradable, environmentally safe packaging"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Start Your Healthy Journey?</h2>
            <p>Join hundreds of satisfied customers in Kopargaon</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
