const Listing = require("./models/listing");
const Review  = require("./models/reviewing.js");
const ExpressErr = require("./utils/ExpressErr.js");
const ListingSchema = require("./schema.js");
const reviewSchema=require('./reviewSchema.js');

module.exports.isLoggeIn = (req,res,next)=>{
    // console.log(req.path, ".....", req.originalUrl);
  if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
    req.flash("error" , "You must be logged in to create a listing");
    return res.redirect("/login");
}
 next();
}

  module.exports.saveRedirectUrl = (req,res,next)=>{
      if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl ;
  }
  next();
}


  module.exports.isOwner = async(req,res,next)=>{
   let {id} = req.params ;
   let listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error" , "You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }
  // Validation middleware
  module.exports.validateListing = (req, res, next) => {
      const { error } = ListingSchema.validate(req.body);
      if (error) {
          const errMsg = error.details.map(el => el.message).join(",");
          throw new ExpressErr(400, errMsg);
      } else {
          next();
      }
  };

  // Revewie Schema
    module.exports.validateReview = (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
      const errMsg = error.details.map(el => el.message).join(",");
      throw new ExpressErr(400 , errMsg);
  }
  else{
      next();
  }
}


  module.exports.isreviewAuthor = async(req,res,next)=>{
    let { reviewId , id }  = req.params ;
    const review = await Review.findById(reviewId);
    
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error" , "You can't delete a review. Since you are not an author of Review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }