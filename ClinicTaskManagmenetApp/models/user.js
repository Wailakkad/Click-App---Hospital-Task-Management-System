const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : String ,
    email : {
        type: String,
        required: true,
        unique: true
    },
    passwordHash : String,
    profileImage: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'nurse', 'reception'],
        default: 'reception',
        required: true
    },
})


module.exports = mongoose.model('User', UserSchema);