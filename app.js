const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", function(req,res){
  res.render("index")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/profile", isLoggedIn , function(req,res){
  res.render("profile");
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

function isLoggedIn(){
  if(req.cookies.token === "") res.redirect("/login");
  else{
  let userData = jwt.verify(req.cookies.token, "abhikmondal");
  req.user = userData;
  console.log(userData);
  }

}

app.listen(3000, function(req,res){
  console.log("Server started on port no 3000.")
})