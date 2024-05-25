const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user");
const { postModel } = require("./models/post");
const { commentModel } = require("./models/post")
const upload = require("./config/multer");
const path = require("path");
const { log } = require("util");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));

app.get("/", function(req,res){
  res.render("index")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/profile", isLoggedIn , async function(req,res){
  let user = await userModel.findOne({email: req.user.email}).populate("posts");
  res.render("profile", {user});
})

app.get("/post", function(req,res){
  res.render("post")
})

app.get("/edit/:id", isLoggedIn, async function(req,res){
 let post = await postModel.findOne({_id: req.params.id});
 res.render("edit",{post})
})

app.get("/like/:userid", isLoggedIn,async function(req,res){
  const post = await postModel.findOne({_id: req.params.userid}).populate("user")
  console.log(req.user.userId,post)
  if(post.likes.indexOf(req.user.userId) === -1){
    post.likes.push(req.user.userId)
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.userId),1)
  }
  await post.save()
  res.redirect("/feed")
})

app.get("/feed",isLoggedIn, async function(req,res){
  const post = await postModel.find().populate("user")
  const comment = await commentModel.find().populate("user")
  console.log(req.user.userId);
  res.render("feed",{post,user: req.user,comment})
})

app.get("/user/profile/:userid",isLoggedIn, async function(req,res){
  const user = await userModel.findOne({_id: req.params.userid}).populate("posts")
  res.render("userProfile",{user})
})

app.get("/user/follow/:userid", isLoggedIn, async function(req,res){
  const user = await userModel.findOne({_id: req.params.userid})
  if(user.followers.indexOf(req.user.userId) === -1){
    user.followers.push(req.user.userId)
  } else{
    user.followers.splice(user.followers.indexOf(req.user.userId),1)
  }
  await user.save()
  res.redirect("/feed")
})

app.post("/register", async function(req,res){
  let {username,email,number,password} = req.body;
  let user = await userModel.findOne({email});
  if(user) res.status(300).send("User already registered.");
  
  bcrypt.genSalt(10, function(err,salt){
    bcrypt.hash(password,salt, async function(err,hash){
     let user = await userModel.create({
        username,
        email,
        number,
        password: hash
      })

     let token = jwt.sign({email: email, userId: user._id},"abhikmondal");
     res.cookie("token", token);
     res.redirect("/profile")
    })
  })
})

app.post("/login", async function(req,res){
  let {email,password} = req.body;
  let user = await userModel.findOne({email});
  if(!user) res.status(500).send("Something went wrong.");

  bcrypt.compare(password,user.password, function(err,result){
    if(result){
      let token = jwt.sign({email: email, userId: user._id}, "abhikmondal");
      res.cookie("token", token);
      res.redirect("/profile");
    }
  })
})

app.get("/logout", function(req,res){
  res.cookie("token", "");
  res.redirect("/login");
})

app.post("/post", isLoggedIn, async function(req,res){
  let {details} = req.body;
  const user = await userModel.findOne({email: req.user.email});
  let post = await postModel.create({
    details,
    user: user._id
  });
  user.posts.push(post);
  await user.save();
  res.redirect("/profile");
})

app.post("/edit/:id", async function(req,res){
 let post = await postModel.findOneAndUpdate({_id: req.params.id},{details: req.body.details});
  res.redirect("/profile");
})

app.post("/upload",isLoggedIn, upload.single("image"), async function(req,res){
  let user = await userModel.findOne({email: req.user.email});
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect("/profile");
})

app.post("/comment/:id", isLoggedIn, async function(req,res){
  const {comment} = req.body
  const createComment = await commentModel.create({comment})
  const post = await postModel.findOne({_id: req.params.id})
  post.comments.push(createComment._id)
  await post.save()
  res.redirect("/feed")
})

function isLoggedIn(req,res,next){
  if(req.cookies.token === "") res.redirect("/login");
  else{
  let userData = jwt.verify(req.cookies.token, "abhikmondal");
  req.user = userData;
  next();
  }
}

app.listen(process.env.PORT, function(req,res){
  console.log("Server started on port no ", process.env.PORT)
})
