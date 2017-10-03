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
        required: true,
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
module.exports.getList = (listId, callback) => {
    let query = { _id: listId };

    CoffeeList.find(query, callback);
};

// newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
};

// add coffee items [] to existing list
module.exports.addToList = (listId, coffees, callback) => {
    let query = { _id: listId };

    CoffeeList.find(query, (err, res) => {
        if (err) {
            return console.error(err);
        }

        // take first result
        res[0].coffees.push(coffees);
        res[0].save(callback);
    });
};

// remove coffee items from existing list, based on index
module.exports.deleteFromList = (listId, coffeeIdx, callback) => {
    let query = { _id: listId };

    CoffeeList.find(query, (err, res) => {
        if (err) {
            return console.error(err);
        }

        res[0].coffees.splice(coffeeIdx, 1);
        res[0].save(callback);
    });
};

// pass an id parameter to coffeeList.remove
module.exports.deleteListById = (listId, callback) => {
    let query = { _id: listId };

    CoffeeList.remove(query, callback);
};
