const express = require('express');
const TiffinDelivery = require('../models/TiffinDeliverySchema')
const User = require('../models/User');
const Settings = require('../models/Settings');
const { auth, adminAuth } = require('../middlewares/auth');
const { sendBillEmail } = require('../utils/email');

const router = express.Router();

// @route   GET /api/tiffin/user-deliveries
// @desc    Get user's tiffin deliveries
// @access  Private (User)

router.get('/user-deliveries', auth, async (req, res) => {
    try {
        const { month, year } = req.query;
        let startDate, endDate;

        if (month && year) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0); 
        } else {
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        const deliveries = await TiffinDelivery.find({
            userId: req.user._id,
            date: { $gte: startDate, $lte: endDate } 
        }).sort({ date: -1 });

        const totalTiffins = deliveries.reduce((sum, delivery) => sum + delivery.totalCount, 0);

        // Format deliveries with consistent date format
        const formattedDeliveries = deliveries.map(delivery => ({
            date: `${delivery.date.getFullYear()}-${String(delivery.date.getMonth() + 1).padStart(2, '0')}-${String(delivery.date.getDate()).padStart(2, '0')}`, // Local date format
            morningDelivered: delivery.morningDelivered,
            eveningDelivered: delivery.eveningDelivered,
            totalCount: delivery.totalCount
        }));

        res.json({
            deliveries: formattedDeliveries, 
            totalTiffins,
            month: startDate.getMonth() + 1,
            year: startDate.getFullYear()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tiffin/admin/all-users
// @desc    Get all users with their tiffin counts
// @access  Private (Admin)

router.get('/admin/all-users', adminAuth, async (req, res) => {
    try {
        const { month, year } = req.query;
        let startDate, endDate;

        if (month && year) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0); 
        } else {
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        const users = await User.find({ role: 'user' });
        
        const usersWithDeliveries = await Promise.all(
            users.map(async (user) => {
                const deliveries = await TiffinDelivery.find({
                    userId: user._id,
                    date: { $gte: startDate, $lte: endDate }
                }).sort({ date: 1 });

                const totalTiffins = deliveries.reduce((sum, delivery) => sum + delivery.totalCount, 0);

                return {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone
                    },
                    deliveries: deliveries.map(delivery => ({
                        date: `${delivery.date.getFullYear()}-${String(delivery.date.getMonth() + 1).padStart(2, '0')}-${String(delivery.date.getDate()).padStart(2, '0')}`, // Local date format
                        morningDelivered: delivery.morningDelivered,
                        eveningDelivered: delivery.eveningDelivered,
                        totalCount: delivery.totalCount
                    })),
                    totalTiffins
                };
            })
        );

        res.json({
            users: usersWithDeliveries,
            month: startDate.getMonth() + 1,
            year: startDate.getFullYear()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/admin/mark-delivery', adminAuth, async (req, res) => {
    try {
        const { userId, date, morningDelivered, eveningDelivered } = req.body;

        if (!userId || !date) {
            return res.status(400).json({ message: 'User Id and date are required' });
        }

        // Parse date string to avoid timezone issues
        const [year, month, day] = date.split('-');
        const deliveryDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        let delivery = await TiffinDelivery.findOne({
            userId,
            date: {
                $gte: deliveryDate,
                $lt: new Date(deliveryDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (!delivery) {
            delivery = new TiffinDelivery({
                userId,
                date: deliveryDate 
            });
        }

        // update delivery status
        const oldMorning = delivery.morningDelivered;
        const oldEvening = delivery.eveningDelivered;

        if (typeof morningDelivered == 'boolean') {
            delivery.morningDelivered = morningDelivered;
            if (morningDelivered) {
                delivery.morningDeliveredAt = new Date();
            }
        }

        if (typeof eveningDelivered == 'boolean') {
            delivery.eveningDelivered = eveningDelivered;
            if (eveningDelivered) {
                delivery.eveningDeliveredAt = new Date();
            }
        }

        await delivery.save();

        res.json({
            message: 'Delivery updated successfully',
            delivery: {
                _id: delivery._id,
                date: `${delivery.date.getFullYear()}-${String(delivery.date.getMonth() + 1).padStart(2, '0')}-${String(delivery.date.getDate()).padStart(2, '0')}`, // Local date format
                morningDelivered: delivery.morningDelivered,
                eveningDelivered: delivery.eveningDelivered,
                totalCount: delivery.totalCount
            }
        });
    } catch (error) {
        console.error('Error in mark-delivery:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});


// @route   POST /api/tiffin/admin/generate-monthly-bill
// @desc    Generate monthly bill and send WhatsApp message
// @access  Private (Admin)

router.post('/admin/generate-monthly-bill', adminAuth, async (req, res) => {
    try {
        const { userId, month, year } = req.body;

        if(!userId || !month || !year) {
            return res.status(400).json({ message: 'User ID, month, adn year are required' });
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const deliveries = await TiffinDelivery.find({
            userId, 
            date: { $gte: startDate, $lte: endDate }  
        });

        const totalTiffins = deliveries.reduce((sum , delivery) => sum + delivery.totalCount, 0);

        // get settings for tiffin price
        let settings = await Settings.findOne();
        if(!settings) {
            settings = new Settings({ tiffinPrice: 50 });
            await settings.save();
        }

        const totalAmount = totalTiffins * settings.tiffinPrice;

        // send email
        const billDetails = {
            month,
            year,
            totalTiffins,
            pricePerTiffin: settings.tiffinPrice,
            totalAmount
        };

        let emailResult = null;
        let emailError = null;
        
        try {
            emailResult = await sendBillEmail(user.email, `${user.firstName} ${user.lastName}`, billDetails);
        } catch (error) {
            emailError = error.message;
            // Don't fail the bill generation if email fails
        }

        res.json({
            message: 'Monthly bill generated and sent successfully',
            billDetails: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email 
                },
                month, 
                year,
                totalTiffins,
                pricePerTiffin: settings.tiffinPrice,
                totalAmount,
                emailStatus: emailResult ? 'sent' : 'failed',
                emailError: emailError,
                emailMessageId: emailResult?.messageId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/tiffin/admin/settings
// @desc    Get settings
// @access  Private (Admin)
router.get('/admin/settings', adminAuth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ tiffinPrice: 50 });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tiffin/admin/settings
// @desc    Update settings
// @access  Private (Admin)
router.put('/admin/settings', adminAuth, async (req, res) => {
  try {
    const { tiffinPrice } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.tiffinPrice = tiffinPrice || settings.tiffinPrice;

    await settings.save();

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;