const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');


//UPDATE
router.put('/:id', async function (req, res) {
    if (req.user.id == req.params.id) {
        try {

            const user = await User.findById(req.params.id);
            await Post.deleteMany({ username: user.username });

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json(updatedUser);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    } else {
        res.status(500).json("you can only update your account");
    }
});

//DELETE
router.delete('/:id', async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    } else {
        res.status(500).json("you can only delete your account");
    }
});

// GET
router.get('/:id', async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});



module.exports = router;