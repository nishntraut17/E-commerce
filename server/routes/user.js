const express = require("express");
const userRouter = express.Router();
const { register, login, verifyEmail } = require("../controllers/user");

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/verify-email', verifyEmail);

module.exports = userRouter;