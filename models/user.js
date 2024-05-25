const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI);

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
