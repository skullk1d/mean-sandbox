// express router
const express = require('express');
const router = express.Router();

// our coffee data
const coffeeList = require('../models/coffeeList.model');

// GET HTTP methods to /coffeeList
router.get('/all', (req, res) => {
    coffeeList.getAllLists((err, lists) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to load all lists. Error: ${err}`
            });
        }

        res.write(JSON.stringify({
            success: true,
            lists
        }, null, 2));
        res.end();
    });
});

router.get('/:id', (req, res) => {
    let id = req.params.id;

    coffeeList.getListById(id, (err, list) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to load list. Error: ${err}`
            });
        }

        res.write(JSON.stringify({
            success: true,
            list
        }, null, 2));
        res.end();
    });
});

router.get('/forUser/:id', (req, res) => {
    let userId = req.params.id;

    coffeeList.getListByUserId(userId, (err, lists) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to load list(s) for user. Error: ${err}`
            });
        }

        res.write(JSON.stringify({
            success: true,
            lists
        }, null, 2));
        res.end();
    });
});

// POST HTTP methods to /coffeeList
router.post('/add', (req, res, next) => {
    let newList = new coffeeList({
        ownerId: req.body.ownerId,
        description: req.body.description,
        coffees: req.body.coffees
    });

    coffeeList.addList(newList, (err, list) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to create a new list. Error: ${err}`
            });
        }

        res.json({
            success: true,
            message: "Added successfully.",
            list
        });
    });
});

router.post('/addTo', (req, res, next) => {
    let id = req.body.id;
    let coffees = req.body.coffees;

    coffeeList.addToList(id, coffees, (err, list) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to add to the list. Error: ${err}`
            });
        } else if (list) {
            res.write(JSON.stringify({
                success: true,
                message: "Added coffees successfully",
                list
            }));
            res.end();
        } else {
            res.json({ success: false });
        }
    });
});

// DELETE HTTP methods to /coffeeList
router.delete('/delete/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;

    coffeeList.deleteListById(id, (err, list) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to delete the list. Error: ${err}`
            });
        } else if (list) {
            res.json({
                success: true,
                message: "Deleted successfully"
            });
        } else {
            res.json({ success: false });
        }
    })
});

router.delete('/deleteFrom', (req, res, next) => {
    let id = req.body.id;
    let coffeeIdx = req.body.idx;

    coffeeList.deleteFromList(id, coffeeIdx, (err, list) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to remove from the list. Error: ${err}`
            });
        } else if (list) {
            res.write(JSON.stringify({
                success: true,
                message: "Removed from list successfully",
                list
            }));
            res.end();
        } else {
            res.json({ success: false });
        }
    });
});

module.exports = router;
