import { Heart, Users, Clock, Award } from "lucide-react";
import "./AboutPage.css";
import Footer from "../../components/Footer/Footer";

const AboutPage = () => {
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "5+", label: "Years Experience", icon: Clock },
    { number: "100%", label: "Fresh Daily", icon: Heart },
    { number: "24/7", label: "Support", icon: Award },
  ];

  const values = [
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every meal prepared with care, just like home",
    },
    {
      icon: Clock,
      title: "Always on Time",
      description: "Reliable delivery that fits your schedule",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Highest standards of hygiene and taste",
    },
  ];

  return (
    <div className="about-page">
      {/* Heading section */}
      <section className="heading-section">
        <div className="heading-container">
          <h2>
            About <span>Us</span>
          </h2>
          <p>
            At SaiSanchit, we bring the comfort of home-cooked meals to your
            doorstep. Made with fresh ingredients and crafted with care, our
            tiffins are perfect for students, professionals, and anyone craving
            healthy, delicious food. With timely delivery and unbeatable taste,
            we’re here to make every meal feel like home.
          </p>
        </div>
      </section>

      {/* Stats Section */}

      <div className="about-stats-wrapper">
        <div className="about-stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="about-stat-card">
                <Icon className="about-stat-icon" />
                <h3 className="about-stat-number">{stat.number}</h3>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why section */}
      <div className="choose-wrapper">
        <h2 className="choose-heading">Why Choose Us</h2>
        <div className="choose-grid">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="choose-card">
                <div className="choose-icon-wrapper">
                  <Icon className="choose-icon" />
                </div>
                <h3 className="choose-title">{value.title}</h3>
                <p className="choose-description">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
