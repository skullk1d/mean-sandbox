// express router
const express = require('express');
const router = express.Router();

// our user data
const user = require('../models/user.model');

// GET HTTP methods to /user
router.get('/all', (req, res) => {
    user.getAllUsers((err, users) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to load all users. Error: ${err}`
            });
        }

        res.write(JSON.stringify({
            success: true,
            users
        }, null, 2));
        res.end();
    });
});

router.get('/:id', (req, res) => {
    let id = req.params.id;

    user.getUserById(id, (err, resUser) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to load user. Error: ${err}`
            });
        }

        res.write(JSON.stringify({
            success: true,
            user: resUser
        }, null, 2));
        res.end();
    });
});


// POST HTTP methods to /user
router.post('/add', (req, res, next) => {
    let newUser = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    user.addUser(newUser, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: `Failed to create a new user. Error: ${err}`
            });
        }

        res.json({
            success: true,
            message: "Added successfully.",
            newUser: user
        });
    });
});

router.post('/update', (req, res, next) => {
    user.updateUser(req.body, (err, updatedUser) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to update the user. Error: ${err}`
            });
        } else if (updatedUser) {
            res.write(JSON.stringify({
                success: true,
                message: "Updated user successfully",
                updatedUser
            }));
            res.end();
        } else {
            res.json({ success: false });
        }
    });
});

// DELETE HTTP methods to /user
router.delete('/delete/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;

    user.deleteUserById(id, (err, user) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to delete the user. Error: ${err}`
            });
        } else if (user) {
            res.json({
                success: true,
                message: "Deleted successfully",
                userId: id
            });
        } else {
            res.json({ success: false });
        }
    })
});

module.exports = router;
