const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user: {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowerCase: true
    },
    password: {
        type : String,
        required : true
    },
    role: {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    }
},{ timestamps: true})

module.exports = mongoose.model('User', UserSchema);