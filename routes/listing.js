const express = require("express");

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");


const { isLoggeIn,isOwner,validateListing } = require("../middleware.js");
const router = express.Router();
const ListiingController = require("../controllers/listing.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});




  router.route("/")
  .get( wrapAsync(ListiingController.index))
  .post(isLoggeIn,
  upload.single("listing[image]"),
     validateListing, 
     wrapAsync(ListiingController.create));
  
  
  // NEW ROUTE
  router.get("/new", isLoggeIn, ListiingController.new);

   // EDIT ROUTE
router.get("/:id/edit", isLoggeIn,isOwner, wrapAsync(ListiingController.edit));

  router.route("/:id")
  .get( wrapAsync(ListiingController.show))
  .put(isLoggeIn,
    isOwner,
      upload.single("listing[image]"),
     validateListing,
      wrapAsync(ListiingController.update))
  .delete(isLoggeIn,isOwner, wrapAsync(ListiingController.destroy));





module.exports = router;