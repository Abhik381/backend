const mongoose = require("mongoose")

mongoose.connect("");

const userSchema = mongoose.Schema({});

module.exports = mongoose.model("user", userSchema)