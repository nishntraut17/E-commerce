const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    try {
        console.log(req.body);
        const emailPresent = await User.findOne({ email: req.body.email });
        if (emailPresent) {
            return res.status(400).send("Email already exists");
        }
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const user = await User({ ...req.body, password: hashedPass });
        const result = await user.save();

        if (!result) {
            return res.status(500).send("Unable to register user");
        }
        return res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Unable to register user");
    }
}

const login = async (req, res) => {
    try {
        const emailPresent = await User.findOne({ email: req.body.email });
        if (!emailPresent) {
            return res.status(400).send("Incorrect credentials");
        }
        const verifyPass = await bcrypt.compare(
            req.body.password,
            emailPresent.password
        );
        if (!verifyPass) {
            return res.status(400).send("Incorrect credentials");
        }
        const token = jwt.sign(
            { userId: emailPresent._id, name: emailPresent.name, email: emailPresent.email },
            process.env.JWT_TOKEN,
            {
                expiresIn: "2 days",
            }
        );
        return res.status(201).send({ msg: "User logged in successfully", token });
    } catch (error) {
        res.status(500).send("Unable to login user");
    }
};

module.exports = { register, login };