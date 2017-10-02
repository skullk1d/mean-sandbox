const mongoose = require('mongoose');

// user schema with personal and registration info (without auth or validation, default id)
const UserSchema = mongoose.Schema({
    firstName: {
      type: String,
      trim: true,
      default: ''
    },
    lastName: {
      type: String,
      trim: true,
      default: ''
    },
    displayName: {
      type: String,
      trim: true
    }
});
