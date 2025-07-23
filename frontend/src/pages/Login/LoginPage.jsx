import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import googleLogo from '../../assets/googlelogo.svg';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Basic example: Replace this with actual validation/API call
        if (email.trim() && password.trim()) {
            // Simulate successful login
            setIsLoggedIn(true);
            navigate('/');
        } else {
            alert('Please enter both email and password.');
        }
    };

    return (
        <div className="outerBox">
            <div className="innerBox">
                <p className="heading">Login</p>

                <form className="loginForm" onSubmit={handleLogin}>
                    <input
                        className="inputField"
                        type="text"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="inputField"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="submitBtn" type="submit">Login</button>

                    <div className="loginRedirect">
                        <p>
                            Don't have an account?
                            <Link to="/signup"> Signup</Link>
                        </p>
                    </div>
                </form>

                <div className="divider">
                    <span>Or</span>
                </div>

                <button className="googleLogin" type="button">
                    <img src={googleLogo} alt="Google logo" className="googleIcon" />
                    <span>Continue with Google</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
