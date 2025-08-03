const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    tiffinPrice: {
        type: Number,
        required: true,
        default: 40 
    }, 
    whatsappApiKey: {
        type: String 
    },
    whatsappNumber: {
        type: String 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Settings', settingsSchema);