// src/pages/SignUpPage.js
import './SignUpPage.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [email, setEmail]        = useState('');
  const [phone, setPhone]        = useState('');
  const [password, setPassword]  = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!firstName || !lastName || !email || !phone || !password) {
      setError("Please fill in all fields!");
      return;
    }

    const result = await register({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword
    });

    if (result.success) {
      // Redirect based on user role
      if (result.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="outerBox">
      <div className="innerBox">
        <p className="heading">Create Account</p>
        <form className="loginForm" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="nameRow">
            <div>
              <input className="inputField" type="text" placeholder="First Name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <input className="inputField" type="text" placeholder="Last Name" value={lastName}
                onChange={(e) => setLastName(e.target.value)} required disabled={loading} />
            </div>
          </div>
          <div>
            <input className="inputField" type="email" placeholder="Email Address" value={email}
              onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <input className="inputField" type="tel" placeholder="Phone Number" value={phone}
              onChange={(e) => setPhone(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <input className="inputField" type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <input className="inputField" type="password" placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
          </div>
          <button className="submitBtn" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <div className="loginRedirect">
            <p>Already have an account?
              <Link to="/login"> login</Link>
            </p>
          </div>
        </form>

       

        
      </div>
    </div>
  );
};

export default SignUpPage;
