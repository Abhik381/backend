const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://abhik:abhik2005@backend.xw7qlrx.mongodb.net/mini_project_1?retryWrites=true&w=majority&appName=Backend");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    number: Number,
    password: String,
    profilePic: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ]
},{timestamps: true});

module.exports = mongoose.model("user", userSchema)
