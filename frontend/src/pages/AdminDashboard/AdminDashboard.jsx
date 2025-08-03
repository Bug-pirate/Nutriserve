import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import {
  Users, Package, Settings, Calendar, MessageSquare, IndianRupee,
  CheckCircle, XCircle, Plus, Check, X, BarChart3
} from 'lucide-react';
import { tiffinService } from '../../services/tiffin';

const UserCard = ({ userData, tiffinPrice, onGenerateBill, onToggleDelivery, selectedMonth, selectedYear, getDaysInMonth, generatingBill }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate all days for the selected month
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  
  return (
    <div className="user-card">
      {/* User Summary Card */}
      <div 
        className="user-summary"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="summary-content">
          {/* Left side - User Details */}
          <div className="user-details">
            <h3 className="user-name">
              {userData.user.firstName} {userData.user.lastName}
            </h3>
            <div className="contact-info">
              <p className="contact-item">
                <span className="contact-icon">📧</span>
                {userData.user.email}
              </p>
              <p className="contact-item">
                <span className="contact-icon">📱</span>
                {userData.user.phone}
              </p>
            </div>
          </div>

          {/* Right side - Tiffin Info and Actions */}
          <div className="tiffin-info">
            <div className="tiffin-top-row">
              <div className="tiffin-summary">
                <p className="tiffin-label">Total Tiffins</p>
                <p className="tiffin-count">{userData.totalTiffins}</p>
                <p className="tiffin-amount">Amount: ₹{userData.totalTiffins * tiffinPrice}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateBill(userData);
                }}
                className="send-bill-button"
                disabled={generatingBill === userData.user._id}
              >
                <MessageSquare className="icon" />
                {generatingBill === userData.user._id ? 'Generating...' : 'Send Bill'}
              </button>
            </div>
            <p className="tiffin-amount-mobile">Amount: ₹{userData.totalTiffins * tiffinPrice}</p>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="expand-icon-container">
            <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              <svg className="expand-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Daily Deliveries Section */}
      {isExpanded && (
        <div className="deliveries-expanded">
          <div className="deliveries-content">
            <h4 className="deliveries-header">
              <Calendar className="icon" />
              Daily Deliveries for {months[selectedMonth - 1]} {selectedYear}
            </h4>
            <div className="delivery-grid">
              {daysInMonth.map((day) => {
                const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const delivery = userData.deliveries.find(d => d.date === dateStr) || {
                  date: dateStr,
                  morningDelivered: false,
                  eveningDelivered: false,
                  totalCount: 0
                };
                
                const today = new Date();
                const isToday = day === today.getDate() && 
                              selectedMonth === today.getMonth() + 1 && 
                              selectedYear === today.getFullYear();
                
                return (
                  <div key={day} className={`delivery-card ${isToday ? 'today' : ''}`}>
                    <div className="delivery-date">
                      {day} {months[selectedMonth - 1].slice(0, 3)}
                      {isToday && <span className="today-badge">Today</span>}
                    </div>
                    <div className="delivery-actions">
                      <div className="delivery-toggles">
                        <div className="delivery-toggle">
                          <span className="delivery-label">Morning</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleDelivery(userData.user._id, dateStr, 'morning');
                            }}
                            className={`toggle-button ${delivery.morningDelivered ? 'delivered' : 'not-delivered'}`}
                          >
                            {delivery.morningDelivered ? (
                              <CheckCircle className="icon" />
                            ) : (
                              <Plus className="icon" />
                            )}
                          </button>
                        </div>
                        <div className="delivery-toggle">
                          <span className="delivery-label">Evening</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleDelivery(userData.user._id, dateStr, 'evening');
                            }}
                            className={`toggle-button ${delivery.eveningDelivered ? 'delivered' : 'not-delivered'}`}
                          >
                            {delivery.eveningDelivered ? (
                              <CheckCircle className="icon" />
                            ) : (
                              <Plus className="icon" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="delivery-total">
                        <span className="total-badge">
                          Total: {delivery.totalCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [generatingBill, setGeneratingBill] = useState(null); // Track which user's bill is being generated
  const [savingDelivery, setSavingDelivery] = useState(null); // Track which delivery is being saved
  const [tiffinPrice, setTiffinPrice] = useState(50);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');

  // Function to get all days in a month
  const getDaysInMonth = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Load users and settings
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Load users with deliveries
        const usersResult = await tiffinService.getAllUsers(selectedMonth, selectedYear);
        if (usersResult.success) {
          setUsers(usersResult.data.users || []);
        } else {
          setError(usersResult.error);
        }

        // Load settings
        const settingsResult = await tiffinService.getSettings();
        if (settingsResult.success) {
          setTiffinPrice(settingsResult.data.tiffinPrice || 50);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMonth, selectedYear]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const toggleDelivery = async (userId, date, type) => {
    const deliveryKey = `${userId}-${date}-${type}`;
    
    // Prevent multiple simultaneous updates for the same delivery
    if (savingDelivery === deliveryKey) {
      return;
    }
    
    try {
      setSavingDelivery(deliveryKey);
      
      // Find current delivery data
      const userIndex = users.findIndex(u => u.user._id === userId);
      if (userIndex === -1) {
        return;
      }

      const deliveryIndex = users[userIndex].deliveries.findIndex(d => d.date === date);
      let currentDelivery = { morningDelivered: false, eveningDelivered: false };
      
      if (deliveryIndex !== -1) {
        currentDelivery = users[userIndex].deliveries[deliveryIndex];
      }

      // Calculate new delivery state
      const morningDelivered = type === 'morning' ? !currentDelivery.morningDelivered : currentDelivery.morningDelivered;
      const eveningDelivered = type === 'evening' ? !currentDelivery.eveningDelivered : currentDelivery.eveningDelivered;

      // Call API to update delivery
      const result = await tiffinService.markDelivery(userId, date, morningDelivered, eveningDelivered);

      if (result.success) {
        // Update local state immediately with the new values
        setUsers(prevUsers => 
          prevUsers.map(userData => {
            if (userData.user._id === userId) {
              let updatedDeliveries = [...userData.deliveries];
              
              // Find existing delivery or create new one
              const existingIndex = updatedDeliveries.findIndex(d => d.date === date);
              
              if (existingIndex !== -1) {
                // Update existing delivery
                updatedDeliveries[existingIndex] = {
                  ...updatedDeliveries[existingIndex],
                  morningDelivered,
                  eveningDelivered,
                  totalCount: (morningDelivered ? 1 : 0) + (eveningDelivered ? 1 : 0)
                };
              } else {
                // Add new delivery
                const newDelivery = {
                  date,
                  morningDelivered,
                  eveningDelivered,
                  totalCount: (morningDelivered ? 1 : 0) + (eveningDelivered ? 1 : 0)
                };
                updatedDeliveries.push(newDelivery);
              }
              
              const totalTiffins = updatedDeliveries.reduce((sum, d) => sum + d.totalCount, 0);
              
              return {
                ...userData,
                deliveries: updatedDeliveries,
                totalTiffins
              };
            }
            return userData;
          })
        );
      } else {
        alert('Failed to update delivery: ' + result.error);
      }
    } catch (error) {
      console.error('Error toggling delivery:', error);
      alert('Failed to update delivery: ' + error.message);
    } finally {
      setSavingDelivery(null);
    }
  };

  const generateBill = async (userData) => {
    // Prevent multiple bill generations for the same user
    if (generatingBill === userData.user._id) {
      return;
    }
    
    try {
      setGeneratingBill(userData.user._id);
      
      // First refresh the user data to ensure we have the latest delivery information
      
      // Reload fresh data from backend
      const usersResult = await tiffinService.getAllUsers(selectedMonth, selectedYear);
      if (usersResult.success) {
        setUsers(usersResult.data.users || []);
        // Find the updated user data
        const updatedUserData = usersResult.data.users.find(u => u.user._id === userData.user._id);
        if (updatedUserData) {
          userData = updatedUserData; // Use the fresh data
        }
      }
      
      const result = await tiffinService.generateBill(
        userData.user._id, 
        selectedMonth, 
        selectedYear
      );
      
      if (result.success) {
        const bill = result.data.billDetails;
        
        let emailMessage = '';
        if (bill.emailStatus === 'sent') {
          emailMessage = `✓ Email sent successfully to ${bill.user.email}`;
          if (bill.emailMessageId) {
            emailMessage += `\nMessage ID: ${bill.emailMessageId}`;
          }
        } else {
          emailMessage = `✗ Email failed to send to ${bill.user.email}`;
          if (bill.emailError) {
            emailMessage += `\nError: ${bill.emailError}`;
          }
        }
        
        alert(`Bill generated for ${bill.user.firstName} ${bill.user.lastName}!

Bill Details:
Total Tiffins: ${bill.totalTiffins}
Price per Tiffin: ₹${bill.pricePerTiffin}
Total Amount: ₹${bill.totalAmount}

Email Status:
${emailMessage}`);
      } else {
        alert('✗ Failed to generate bill: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('✗ Failed to generate bill: ' + error.message);
    } finally {
      setGeneratingBill(null);
    }
  };

  const updateTiffinPrice = async (newPrice) => {
    try {
      const result = await tiffinService.updateSettings({ tiffinPrice: newPrice });
      
      if (result.success) {
        setTiffinPrice(newPrice);
        alert('Tiffin price updated successfully!');
      } else {
        alert('Failed to update tiffin price: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating tiffin price:', error);
      alert('Failed to update tiffin price');
    }
  };

  const totalUsers = users.length;
  const totalTiffinsThisMonth = users.reduce((sum, userData) => sum + userData.totalTiffins, 0);
  const totalRevenue = totalTiffinsThisMonth * tiffinPrice;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <div className="tabs-border">
            <nav className="tabs-nav">
              <button
                onClick={() => setActiveTab('users')}
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              >
                <Users className="icon" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Settings className="icon" />
                Settings
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'users' && (
          <>
            {/* Month/Year Selector */}
            <div className="month-selector-card">
              <div className="selector-header">
                <h2 className="selector-title">
                  <Calendar className="icon" />
                  Select Month & Year
                </h2>
              </div>
              <div className="selector-controls">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="month-select"
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
                  className="year-select"
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
            <div className="summary-cards">
              <div className="summary-card users-card">
                <div className="summary-card-content">
                  <div className="summary-info">
                    <p className="summary-label">Total Users</p>
                    <p className="summary-value users-value">{totalUsers}</p>
                  </div>
                  <div className="summary-icon users-icon">
                    <Users className="icon" />
                  </div>
                </div>
              </div>
              
              <div className="summary-card tiffins-card">
                <div className="summary-card-content">
                  <div className="summary-info">
                    <p className="summary-label">Total Tiffins</p>
                    <p className="summary-value tiffins-value">{totalTiffinsThisMonth}</p>
                  </div>
                  <div className="summary-icon tiffins-icon">
                    <Package className="icon" />
                  </div>
                </div>
              </div>
              
              <div className="summary-card revenue-card">
                <div className="summary-card-content">
                  <div className="summary-info">
                    <p className="summary-label">Revenue</p>
                    <p className="summary-value revenue-value">₹{totalRevenue}</p>
                  </div>
                  <div className="summary-icon revenue-icon">
                    <IndianRupee className="icon" />
                  </div>
                </div>
              </div>
              
              <div className="summary-card price-card">
                <div className="summary-card-content">
                  <div className="summary-info">
                    <p className="summary-label">Price/Tiffin</p>
                    <p className="summary-value price-value">₹{tiffinPrice}</p>
                  </div>
                  <div className="summary-icon price-icon">
                    <IndianRupee className="icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Management */}
            <div className="users-list">
              {users.map((userData) => (
                <UserCard 
                  key={userData.user._id} 
                  userData={userData} 
                  tiffinPrice={tiffinPrice}
                  onGenerateBill={generateBill}
                  onToggleDelivery={toggleDelivery}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  getDaysInMonth={getDaysInMonth}
                  generatingBill={generatingBill}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="settings-card">
            <h2 className="settings-title">
              <Settings className="icon" />
              Application Settings
            </h2>
            
            <div className="settings-form">
              <label className="settings-label">
                Tiffin Price (₹)
              </label>
              <div className="price-input-container">
                <input
                  type="number"
                  value={tiffinPrice}
                  onChange={(e) => setTiffinPrice(parseInt(e.target.value) || 0)}
                  className="price-input"
                  min="1"
                />
                <button 
                  onClick={() => updateTiffinPrice(tiffinPrice)}
                  className="update-btn"
                >
                  Update
                </button>
              </div>
              <p className="settings-help">
                This price will be used for calculating monthly bills.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
