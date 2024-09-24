const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router( { mergeParams: true });
const Listing = require("../models/listing.js");
const Review  = require("../models/reviewing.js");
const {validateReview,isLoggeIn,isreviewAuthor} = require("../middleware.js")

  const ReviewController = require("../controllers/reviews.js")
// Post a review

router.post("/" , isLoggeIn,validateReview, wrapAsync(ReviewController.PostReview ))  
 
// Delete Review Route

router.delete("/:reviewId" ,isreviewAuthor,wrapAsync(ReviewController.DestroyReview))

module.exports = router;