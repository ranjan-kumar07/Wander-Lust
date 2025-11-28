const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isReviewAuthor} =require("../middleware.js");

const Review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");



const validateReview = (req, res, next) => {
    const data = req.body.review;
    let { error } = reviewSchema.validate({ review: data });

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    next();
};


// REVIEWS-> POST ROUTE

router.post("/",
    isLoggedIn,
    validateReview, asyncWrap(reviewController.createReviews));

//DELETE Reviews Route

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     asyncWrap(reviewController.destroyReviews));

module.exports = router;



