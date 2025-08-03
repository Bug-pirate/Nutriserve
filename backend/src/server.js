// Entry point  
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS configuration to allow cookies
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Enable cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tiffin', require('./routes/tiffin'));
app.use('/api/contact', require('./routes/contact'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Nutriserve API is running!',
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    userAgent: req.get('User-Agent')
  });
});

// Debug route for mobile testing
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint reached successfully',
    clientIP: req.ip,
    headers: req.headers,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
    server: 'Nutriserve Backend'
  });
});


app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ massage: 'Something went wrong!' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.send('Server is running...');
// });

// Start server on all interfaces to allow mobile access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://localhost:${PORT}`);
  
  // Get and display all network interfaces
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  console.log('Network access available on:');
  Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName]
      .filter(details => details.family === 'IPv4' && !details.internal)
      .forEach(details => {
        console.log(`  http://${details.address}:${PORT}`);
      });
  });
});


const createAdminUser = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@nutriserve.com',
        phone: '9999999999',
        password: 'admin123',
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user creatd: admin@nutriserve.com/ admin');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

mongoose.connection.once('open', () => {
  createAdminUser();
});