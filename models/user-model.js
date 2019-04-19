const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    facebookID: String,
    email: String,
    password: String,
    verified: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    userRegistrationTime: String,
    registrationToken: String,
    passwordResetTime: String

});


const User = mongoose.model('user', userSchema);

module.exports = User