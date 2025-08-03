import React, { useState, useEffect } from 'react';
import { Calendar, Package, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tiffinService } from '../../services/tiffin';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [totalTiffins, setTotalTiffins] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDeliveries = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const result = await tiffinService.getUserDeliveries(selectedMonth, selectedYear);
        
        if (result.success) {
          setDeliveries(result.data.deliveries || []);
          setTotalTiffins(result.data.totalTiffins || 0);
        } else {
          console.error('Error fetching deliveries:', result.error);
          setDeliveries([]);
          setTotalTiffins(0);
        }
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setDeliveries([]);
        setTotalTiffins(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDeliveries();
  }, [selectedMonth, selectedYear, user]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        {/* Month & Year Selector */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Select Month & Year
            </h2>
          </div>
          <div className="selector">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="select-input"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="select-input"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-content">
              <div>
                <p className="summary-label">Total Tiffins</p>
                <p className="summary-value text-blue-600">{totalTiffins}</p>
              </div>
              <div className="summary-icon bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-content">
              <div>
                <p className="summary-label">This Month</p>
                <p className="summary-value text-green-600">{months[selectedMonth - 1]}</p>
              </div>
              <div className="summary-icon bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-content">
              <div>
                <p className="summary-label">Active Days</p>
                <p className="summary-value text-purple-600">{deliveries.length}</p>
              </div>
              <div className="summary-icon bg-purple-100">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="card">
          <div className="table-header">
            <h3>Daily Tiffin Deliveries</h3>
            <p>Track your daily tiffin consumption</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Morning</th>
                  <th>Evening</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.length > 0 ? (
                  deliveries.map((delivery, index) => (
                    <tr key={index}>
                      <td>{formatDate(delivery.date)}</td>
                      <td>
                        <span className={`badge ${delivery.morningDelivered ? 'delivered' : 'not-delivered'}`}>
                          {delivery.morningDelivered ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${delivery.eveningDelivered ? 'delivered' : 'not-delivered'}`}>
                          {delivery.eveningDelivered ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td className="count">{delivery.totalCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      {loading ? 'Loading deliveries...' : 'No deliveries found for this month. Deliveries will appear here when marked by admin.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
