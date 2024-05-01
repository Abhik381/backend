const mongoose = require("mongoose")

mongoose.connect("");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    number: Number,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
},{timestamps: true});

module.exports = mongoose.model("user", userSchema)