require('dotenv').config();
const accessToken = process.env.ACCESS_TOKEN;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");
const isLoggeIn = require("./middleware.js");


const app = express();
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash  = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require('console');
// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECRET
        },
    touchAfter : 24 * 3600,
  })
  
   store.on("error" , ()=>{
    console.log("Error in mongodb store!" , error);
   })
  const sessionOption = {
    store,
     secret: process.env.SECRET,
    resave : false ,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
  };

  
  

  main()
  .then(()=>{
    console.log("DB is connected");
  })
.catch(err => console.log(err));

// Database connection
async function main() {
      await mongoose.connect(dburl);
}



// Define port
const port = 8080;

// // Root route
// app.get("/", (req, res) => {
//     res.send("You are on the root directory");
// });



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));





passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use((req,res,next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next();
 });

//  app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email :"st@gmail.com",
//         username : "st"
//     })
//     let registerUser =  await  User.register(fakeUser,"HelloWorld");
//     res.send(registerUser);
//  }) ;


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews" ,reviewRouter );
app.use("/",userRouter);


// 404 
app.all("*", (req, res, next) => {
    next(new ExpressErr(404, "Page not found"));
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Some error" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});


// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});



