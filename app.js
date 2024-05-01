const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

app.post("/register", function(req,res){

})

app.listen(3000, function(req,res){
  console.log("Server started on port no 3000.")
})