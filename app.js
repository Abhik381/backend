const cookieParser = require("cookie-parser");
const express = require("express")
const app = express();

app.use(cookieParser());

app.get("/", function(req,res){
res.cookie("name","Aditi")
  res.send("hii")
})

app.get("/read",function(req,res){
  console.log(req.cookies.name);
  res.send("read")
})

app.listen(3000)