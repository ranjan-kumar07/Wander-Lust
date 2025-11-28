const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});



// Middlewares for error

const validateListing = (req,res,next) =>{
    const data =  req.body.listing;
    
    let { error } = listingSchema.validate({ listing: data });
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};


router.route("/")
.get( asyncWrap(listingController.index))
.post(
  isLoggedIn,
  
  upload.single('listing[image]'),
  validateListing,
  asyncWrap(listingController.createListing));



  // NEW ROUTE for->  to get new form for new data

router.get("/new", isLoggedIn,listingController.renderNewForm );


router.route("/:id")
.get( asyncWrap(listingController.showListing))
.put(isLoggedIn,
  isOwner, 
    upload.single('listing[image]'),
  validateListing,asyncWrap(listingController.updateListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing));

//EDIT ROUTE -> to edit individual route through id , it will render a edit form 

router.get("/:id/edit", isLoggedIn,isOwner,asyncWrap(listingController.renderEditForm));



module.exports  = router;
