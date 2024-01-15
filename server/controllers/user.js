const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const { sendVerificationMail } = require('../util/sendVerificationMail');

const register = async (req, res) => {
    try {
        console.log(req.body);
        const userPresent = await User.findOne({ email: req.body.email });
        if (userPresent) {
            return res.status(400).send("Email already exists");
        }
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const user = await User({ ...req.body, password: hashedPass, emailToken: crypto.randomBytes(64).toString("hex") });
        const result = await user.save();
        sendVerificationMail(user);

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
        const userPresent = await User.findOne({ email: req.body.email });
        if (!userPresent) {
            return res.status(400).send("Incorrect credentials");
        }
        const verifyPass = await bcrypt.compare(
            req.body.password,
            userPresent.password
        );
        if (!verifyPass) {
            return res.status(401).send("Incorrect credentials");
        }
        if (userPresent.isVerified == false) {
            return res.status(400).send("Email not verified");
        }
        const token = jwt.sign(
            { _id: userPresent._id, name: userPresent.name, email: userPresent.email, isVerified: userPresent?.isVerified },
            process.env.JWT_TOKEN,
            { expiresIn: "2d", }
        );
        return res.status(201).send({ msg: "User logged in successfully", token });
    } catch (error) {
        res.status(500).send("Unable to login user");
    }
};

const verifyEmail = async (req, res) => {
    try {
        console.log(req.body);
        const emailToken = req.body.emailToken;
        if (!emailToken) return res.status(404).send("Email Token not found...");

        const user = await User.findOne({ emailToken });

        if (user) {
            user.emailToken = null;
            user.isVerified = true;

            await user.save();

            const token = jwt.sign(
                { _id: user._id, name: user.name, email: user.email, isVerified: user?.isVerified },
                process.env.JWT_TOKEN,
                {
                    expiresIn: "2 days",
                }
            );

            res.status(200).send(token);

        } else res.status(404).send("Email verification failed, invalid token !");
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

module.exports = { register, login, verifyEmail };