const mongoose = require('mongoose');

// coffee list schema with id, date and localized date description (default id)
const CoffeeListSchema = mongoose.Schema({
    dateTime: {
        type: Number,
        required: true
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

// newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
};

// pass an id parameter to coffeeList.remove
module.exports.deleteListById = (id, callback) => {
    let query = { _id: id };
    CoffeeList.remove(query, callback);
};
