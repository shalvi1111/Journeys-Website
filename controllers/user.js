const User = require("../models/user.js");


module.exports.getSignUp = (req,res)=>{
    res.render("users/signup.ejs");
    }


module.exports.PostSignUp = async(req,res)=>{
    try{ 
     let {email , username , password} = req.body ;
     const newUser =  new User ({email , username});
     const registeredUser =  await User.register(newUser , password);
     console.log(registeredUser);
     req.login(registeredUser , (err)=>{
        if(err){
        return next(err);
        }
        req.flash("success" , "User was registered successfully");
     res.redirect("/listings");
     })
     
     }
     catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
     }
  }


  module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
   }


  module.exports.postLogin =  async (req,res) =>{
    req.flash("success" , "You had successfully Login");
    res.redirect( "/listings");
   }
 

  module.exports.getLogOut = (req,res)=>{
    req.logout( (err)=>{
       if(err){
          return next(err);
       }
    req.flash("success", "You logged out") ;
    res.redirect("/listings");  
    })
  }

   