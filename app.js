//jshint esversion:6

require('dotenv').config();
 const express= require("express");
 const app=express();
 const mongoose=require("mongoose");
 const bodyParser= require("body-parser");
 const ejs=require("ejs");
 const encrypt = require("mongoose-encryption");
 //const md5=require("md5");
 const bcrypt=require("bcrypt");
 const saltRounds=10;

 app.use(bodyParser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 app.use(express.static("public"));


 //--------------mongoose---------------

 mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

 const userSchema = new mongoose.Schema({
   email:String,
   password:String
 });
//
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']});
//
 const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email:req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(!err)
      res.render("secrets");
      else console.log(err);
    });
});
});

app.post("/login",function(req,res){
  const email=req.body.username;
  const password=(req.body.password);
  User.findOne({email:email},function(err,foundUser){
    if(err)console.log(err);
    else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result==true)
          res.render("secrets");
        });
      }
    }
  });
});

 app.listen(3000,function(){
   console.log("Server Started on port 3000");
 });
