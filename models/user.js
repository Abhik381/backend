const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://abhik:abhik2005@backend.xw7qlrx.mongodb.net/mini_project_1");

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
