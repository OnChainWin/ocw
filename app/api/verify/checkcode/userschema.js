// userschema.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  wallet: String,
  email: String,
  emailverified: Boolean,
  emailverificationtoken: String,
  usedrefcode: String,
  refcode: String,
  premium: Boolean
});

module.exports =  mongoose.models.User || mongoose.model('User', UserSchema); 