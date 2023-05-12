const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const newUser = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            console.log(newUser);
            res.status(500).json(newUser);
        }
        else {
            res.status(500).json("user already exists");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("wrong credentials");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("wrong credentials");

    // escaping password from the output
    const { password, ...others } = user._doc;
    res.status(200).json(others);
});

module.exports = router;