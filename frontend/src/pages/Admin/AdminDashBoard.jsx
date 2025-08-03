import axios from "axios";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    axios.get("/api/users/all").then(res => setUsers(res.data));
  }, []);

  const handleMark = async (userId, slot) => {
    await axios.post("/api/delivery/mark", {
      userId,
      date: today,
      slot
    });
    alert(`Marked ${slot} tiffin for user`);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Panel - Mark Deliveries</h2>
      {users.map((user, i) => (
        <div key={i} className="admin-user-card">
          <p className="admin-user-name">{user.firstname} {user.lastname} - {user.phone}</p>
          <div className="admin-buttons">
            <button
              className="btn-morning"
              onClick={() => handleMark(user._id, "morning")}
            >
              Morning <CheckCircle size={16} style={{marginLeft: '4px'}} />
            </button>
            <button
              className="btn-evening"
              onClick={() => handleMark(user._id, "evening")}
            >
              Evening <CheckCircle size={16} style={{marginLeft: '4px'}} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
