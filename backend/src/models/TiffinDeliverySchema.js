const mongoose = require('mongoose');

const TiffinDeliverySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    morningDelivered: {
        type: Boolean,
        default: false
    },
    eveningDelivered: {
        type: Boolean,
        default: false
    },
    morningDeliveredAt: {
        type: Date
    },
    eveningDeliveredAt: {
        type: Date
    },
    totalCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});


TiffinDeliverySchema.pre('save', function(next) {
    this.totalCount = (this.morningDelivered ? 1 : 0) + (this.eveningDelivered ? 1 : 0);
    next();
});

module.exports = mongoose.model('TiffinDelivery', TiffinDeliverySchema);

