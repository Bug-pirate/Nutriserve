import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/Signup/SignUpPage';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar.jsx';
import AboutPage from './pages/About/AboutPage.jsx';
import Contact  from './pages/Contact/ContactPage.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard/UserDashboard.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            minHeight: 'calc(100vh - 90px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Go Home
            </button>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
