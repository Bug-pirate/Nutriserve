const express = require('express');
const { sendContactEmail } = require('../utils/email');
const router = express.Router();

// POST /api/contact/send-message
router.post('/send-message', async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send contact email
    const emailResult = await sendContactEmail({
      fullName,
      email,
      subject,
      message
    });

    if (emailResult.messageId) {
      res.json({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.',
        messageId: emailResult.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

module.exports = router;
