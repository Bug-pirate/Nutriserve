// src/pages/SignUpPage.js
import './SignUpPage.css';
import googlelogo from '../../assets/googlelogo.svg';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { auth } from '../../firebase'; // adjust the path if needed
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [email, setEmail]        = useState('');
  const [phone, setPhone]        = useState('');
  const [password, setPassword]  = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      alert("Account created successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google user:", result.user);
      navigate('/dashboard'); // or wherever you want to redirect
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="outerBox">
      <div className="innerBox">
        <p className="heading">Create Account</p>
        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="nameRow">
            <div>
              <input className="inputField" type="text" placeholder="First Name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
              <input className="inputField" type="text" placeholder="Last Name" value={lastName}
                onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div>
            <input className="inputField" type="email" placeholder="Email Address" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <input className="inputField" type="tel" placeholder="Phone Number" value={phone}
              onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <input className="inputField" type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <input className="inputField" type="password" placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="submitBtn" type="submit">Create Account</button>
          <div className="loginRedirect">
            <p>Already have an account?
              <Link to="/login"> login</Link>
            </p>
          </div>
        </form>

        <div className="divider"><span>Or</span></div>

        <button className="googleLogin" onClick={handleGoogleSignup}>
          <img src={googlelogo} alt="Google Logo" className="googleIcon" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
