import "./ContactCard.css";

const ContactCard = ({icon: Icon, title, value}) => {
  return (
    <div className="contact-card">
      <div className="contact-icon">
        <Icon className="contact-symbol" size={24} />
      </div>
      <div className="contact-description">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default ContactCard;
