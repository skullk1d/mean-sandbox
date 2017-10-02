// express router
const express = require('express');
const router = express.Router();

// our coffee data
const coffeeList = require('../models/coffeeList.model');

// GET HTTP method to /coffeeList
router.get('/', (req, res) => {
    debugger
    coffeeList.getAllLists((err, lists) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to load all lists. Error: ${err}`
            });
        }
        else {
            res.write(JSON.stringify({
                success: true,
                lists
            }, null, 2));

            res.end();
        }
    });
});

// POST HTTP method to /coffeeList
router.post('/', (req, res, next) => {
    let newList = new coffeeList({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
    });
    coffeeList.addList(newList, (err, list) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to create a new list. Error: ${err}`
            });
        }
        else  {
            res.json({
                success:true,
                message: "Added successfully."
            });
        }
    });
});


// DELETE HTTP method to /coffeeList
// accepts an id
router.delete('/:id', (req, res, next) => {
  //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
  //Call the model method deleteListById
    coffeeList.deleteListById(id, (err, list) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to delete the list. Error: ${err}`
            });
        }
        else if (list) {
            res.json({
                success: true,
                message: "Deleted successfully"
            });
        }
        else {
            res.json({ success: false });
        }
    })
});

module.exports = router;
