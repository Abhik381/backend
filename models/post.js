const mongoose = require("mongoose")


const commentSchema = mongoose.Schema({
    comment: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }
},{timestamps: true})


const postSchema = mongoose.Schema({
    details: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
},{timestamps: true});

const postModel = mongoose.model("post", postSchema)
const commentModel = mongoose.model("comment" , commentSchema)

module.exports = {
    postModel,
    commentModel
}
