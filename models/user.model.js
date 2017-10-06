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

// convert to a model and export
const User = module.exports = mongoose.model('User', UserSchema);

/*
* Methods
*/

// find() returns all the users
module.exports.getAllUsers = (callback) => {
    User.find(callback);
};

// get a specific user
module.exports.getUserById = (userId, callback) => {
    let query = { _id: userId };

    User.find(query, callback);
};

// newUser.save is used to insert the document into MongoDB
module.exports.addUser = (newUser, callback) => {
    newUser.displayName = `${newUser.firstName} ${newUser.lastName}`;
    newUser.save(callback);
};

// update user profile info
module.exports.updateUser = (updatedUser, callback) => {
    let query = { _id: updatedUser._id };

    User.find(query, (err, res) => {
        if (err) {
            return console.error(err);
        }

        // auto-update display name and everything that changed
        Object.assign({}, res[0], updatedUser);
        res[0].displayName = `${res[0].firstName} ${res[0].lastName}`
        res[0].save(callback);
    });
};

// pass an id parameter to userUser.remove
module.exports.deleteUserById = (userId, callback) => {
    let query = { _id: userId };

    User.remove(query, callback);
};
