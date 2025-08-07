const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["Full Name Field is Mendatory"]
    },
    username: {
        type: String,
        unique: true,
        required: ["Username Field is Mendatory"]
    },
    email: {
        type: String,
        unique: true,
        required: ["Username Field is Mendatory"]
    },
    phone: {
        type: String,
        required: ["Phone Field is Mendatory"]
    },
    password: {
        type: String,
        required: ["Password Field is Mendatory"]
    },
    role: {
        type: String,
        default: "Admin"
    },
    passwordReset: {
        type: Object
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const User = new mongoose.model("User", UserSchema)

module.exports = User