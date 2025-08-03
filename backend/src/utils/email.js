// utils/email.js
const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_CONFIG = {
  service: 'gmail', // You can change this to other services like outlook, yahoo, etc.
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
};

// Initialize transporter
let transporter = null;

const initializeEmailService = () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Email sending will be simulated.');
      return false;
    }

    transporter = nodemailer.createTransport({
      ...EMAIL_CONFIG,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('Email service initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize email service:', error.message);
    return false;
  }
};

// Initialize on module load
const isEmailConfigured = initializeEmailService();

const sendEmail = async (to, subject, text, html = null) => {
  try {
    // If email is not configured, simulate the message
    if (!transporter || !isEmailConfigured) {
      console.log('SIMULATED Email to', to, ':', subject);
      return { messageId: 'simulated_' + Date.now() };
    }

    const mailOptions = {
      from: `"NutriServe" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html || `<pre>${text}</pre>` // Use HTML version or convert text to HTML
    };

    const result = await transporter.sendMail(mailOptions);
    
    
    return result;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your email credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Email connection failed. Please check your internet connection.');
    } else if (error.responseCode === 535) {
      throw new Error('Invalid email credentials. Please verify your email and app password.');
    }
    
    throw error;
  }
};

// Helper function to send bill email
const sendBillEmail = async (userEmail, userName, billDetails) => {
  const { month, year, totalTiffins, pricePerTiffin, totalAmount } = billDetails;
  
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  
  const subject = `NutriServe Monthly Bill - ${monthName} ${year}`;
  
  const text = `Hello ${userName},

Your NutriServe monthly bill for ${monthName} ${year}:

Bill Summary:
• Total Tiffins Delivered: ${totalTiffins}
• Price per Tiffin: ₹${pricePerTiffin}
• Total Amount: ₹${totalAmount}

Thank you for choosing NutriServe!

Best regards,
NutriServe Team

---
This is an automated email. Please do not reply to this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563EB; text-align: center;">&#x1F37D;&#xFE0F; NutriServe Monthly Bill</h2>
      
      <p>Hello <strong>${userName}</strong>,</p>
      
      <p>Your monthly bill for <strong>${monthName} ${year}</strong> is ready:</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">&#x1F4CA; Bill Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Total Tiffins Delivered:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${totalTiffins}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Price per Tiffin:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${pricePerTiffin}</td>
          </tr>
          <tr style="background: #e5f3ff;">
            <td style="padding: 12px 8px; font-size: 18px;"><strong>Total Amount:</strong></td>
            <td style="padding: 12px 8px; font-size: 18px; text-align: right; color: #2563EB;"><strong>₹${totalAmount}</strong></td>
          </tr>
        </table>
      </div>
      
      <p>Thank you for choosing NutriServe! &#x1F64F;</p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        Best regards,<br>
        <strong>NutriServe Team</strong><br><br>
        <em>This is an automated email. Please do not reply to this email.</em>
      </p>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

// Helper function to send test email
const sendTestEmail = async (userEmail, testMessage = null) => {
  const subject = 'Test Email from NutriServe Admin';
  
  const text = testMessage || `This is a test email from NutriServe Admin Panel.

This email confirms that email delivery is working correctly for your account.

Time: ${new Date().toLocaleString()}

If you receive this email, our email system is functioning properly!

Best regards,
NutriServe Admin Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563EB; text-align: center;">&#x1F9EA; Test Email from NutriServe</h2>
      
      <p>${(testMessage || text).replace(/\n/g, '<br>')}</p>
      
      <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: #2563EB; font-weight: bold;">&#x2705; Email delivery is working correctly!</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        <strong>NutriServe Admin Team</strong><br>
        <em>Time: ${new Date().toLocaleString()}</em>
      </p>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

// Helper function to send contact form email
const sendContactEmail = async (contactData) => {
  const { fullName, email, subject, message } = contactData;
  
  // Email to the business owner
  const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_USER;
  const emailSubject = `Contact from ${fullName}: ${subject}`;
  
  const text = `You have received a new message from your website contact form:

FROM: ${fullName} <${email}>
SUBJECT: ${subject}

MESSAGE:
${message}

---
To reply to this message, send your response directly to: ${email}

This message was sent from the NutriServe contact form.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2563EB; text-align: center; margin-bottom: 30px;">&#x1F4E8; New Message from Website</h2>
      
      <div style="background: #e3f2fd; padding: 20px; border-left: 4px solid #2563EB; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Message From:</h3>
        <p style="font-size: 18px; margin: 5px 0;"><strong>${fullName}</strong></p>
        <p style="color: #2563EB; margin: 5px 0;"><a href="mailto:${email}" style="text-decoration: none; color: #2563EB;">${email}</a></p>
        <p style="margin: 10px 0 0 0;"><strong>Subject:</strong> ${subject}</p>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #1f2937;">Message:</h3>
        <p style="line-height: 1.6; color: #374151; white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f8ff; border-radius: 8px; border: 2px solid #2563EB;">
        <h3 style="margin-top: 0; color: #2563EB;">Quick Reply</h3>
        <p style="margin: 10px 0;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
             style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            &#x1F4E7; Reply to ${fullName}
          </a>
        </p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;">Click the button above to reply directly to ${fullName}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        <strong>NutriServe Contact Form</strong><br>
        <em>This message was sent from your website's contact form at ${new Date().toLocaleString()}</em>
      </p>
    </div>
  `;

  // Configure email - sent from system email but with clear sender identification
  const mailOptions = {
    from: `"NutriServe Contact Form" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    replyTo: `"${fullName}" <${email}>`,
    subject: emailSubject,
    text: text,
    html: html
  };

  try {
    // If email is not configured, simulate the message
    if (!transporter || !isEmailConfigured) {
      console.log('SIMULATED Contact Email');
      console.log('From Customer:', fullName, '<' + email + '>');
      console.log('To Owner:', ownerEmail);
      console.log('Subject:', emailSubject);
      console.log('Message:', message);
      return { messageId: 'simulated_contact_' + Date.now() };
    }

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Contact email sending failed:', error.message);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendBillEmail,
  sendTestEmail,
  sendContactEmail,
  isEmailConfigured
};
