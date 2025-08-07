const mongoose = require("mongoose")

const SettingSchema = new mongoose.Schema({
    map1: {
        type: String,
        default: ""
    },
    map2: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    whatsapp: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    aboutUsVideo: {
        type: String,
        default: ""
    },
    teacherCounter: {
        type: Number,
        default: 0
    },
    studentCounter: {
        type: Number,
        default: 0
    },
    eventCounter: {
        type: Number,
        default: 0
    },
    parentCounter: {
        type: Number,
        default: 0
    },
    facebook: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    youtube: {
        type: String,
        default: ""
    },
    createBy: {
        type: String
    },
    updateBy: []
}, { timestamps: true })

const Setting = new mongoose.model("Setting", SettingSchema)

module.exports = Setting