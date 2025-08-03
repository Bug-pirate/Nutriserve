// User model 

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }, 
    isActive: {
        type: Boolean,
        default: true
    }  
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {  //pre-save hook
    if(!this.isModified('password')) return next(); //If password is not modified, it skips hashing and just saves the document
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// custom method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};



module.exports = mongoose.model('User', userSchema);