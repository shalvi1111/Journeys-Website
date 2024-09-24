const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { route } = require("./listing.js");
const {saveRedirectUrl} = require("../middleware.js");
 const UserController = require("../Controllers/user.js")
const router = express.Router() ;

   router.get("/signup" ,UserController.getSignUp) ;


   router.post("/signup" , wrapAsync (UserController.PostSignUp));

     router.get("/login" , UserController.getLogin) ;

     router.post(
      "/login" ,saveRedirectUrl
      ,passport.authenticate("local" , {
           failureRedirect :"/login" ,
           failureFlash : true
      }) ,  UserController.postLogin )

   
      router.get("/logout" , UserController.getLogOut);


  module.exports = router;