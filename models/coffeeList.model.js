const mongoose = require('mongoose');

// coffee list schema with id, date and localized date description (default id)
// users can own multiple lists, so duplicate ownerId is fine as long as we have unique _id
const CoffeeListSchema = mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    coffees: {
        type: [String],
        default: []
    },
    description: String
});

// convert to a model and export
const CoffeeList = module.exports = mongoose.model('CoffeeList', CoffeeListSchema);

/*
* Methods
*/

// find() returns all the lists
module.exports.getAllLists = (callback) => {
    CoffeeList.find(callback);
};

// get a specific list
module.exports.getListById = (listId, callback) => {
    let query = { _id: listId };

    CoffeeList.find(query, callback);
};

// get a specific lists for user
module.exports.getListByUserId = (userId, callback) => {
    let query = { ownerId: userId };

    CoffeeList.find(query, callback);
};

// newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
};

// add coffee items [] to existing list
module.exports.addToList = (listId, coffees, callback) => {
    let query = { _id: listId };

    // take first result
    CoffeeList.findOne(query, (err, res) => {
        if (err) {
            return console.error(err);
        }

        res.coffees.push(coffees);
        res.save(callback);
    });
};

// remove coffee items from existing list, based on index
module.exports.deleteFromList = (listId, coffeeIdx, callback) => {
    let query = { _id: listId };

    CoffeeList.findOne(query, (err, res) => {
        if (err) {
            return console.error(err);
        }

        if (res.coffees.length) {
            res.coffees.splice(coffeeIdx, 1);
        }

        res.save(callback);
    });
};

// pass an id parameter to coffeeList.remove
module.exports.deleteListById = (listId, callback) => {
    let query = { _id: listId };

    CoffeeList.remove(query, callback);
};
