import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/Signup/SignUpPage';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar.jsx';
import { useState } from 'react';
import AboutPage from './pages/About/AboutPage.jsx';
import Contact  from './pages/Contact/ContactPage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

      </Routes>
    </>
  );
}

export default App;
