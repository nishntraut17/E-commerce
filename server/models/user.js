const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, required: true
    },
    isVerified: {
        type: Boolean, default: false,
    },
    emailToken: { type: String },
})

module.exports = mongoose.model("User", userSchema);