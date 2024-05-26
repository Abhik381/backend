const mongoose = require("mongoose")


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log("Database not connected: ", console.error());
})

mongoose.connect("mongodb+srv://abhik:abhik2005@backend.xw7qlrx.mongodb.net/mini_project_1?retryWrites=true&w=majority&appName=Backend"
                )
.then()=>{
    console.log("Database connected");
}
.catch(err)=>{
    console.log("error" , err);
}


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
