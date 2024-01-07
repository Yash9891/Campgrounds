const express=require('express');
const router =express.Router({mergeParams:true});
const Campground=require('../models/campground')
const Review = require('../models/review');
//error handling
const expressError=require('../utils/ExpressError')
const catchAsync=require('../utils/catchAsync')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');
const review = require('../models/review');
const reviews=require('../controllers/reviews.js')



//Route1 to create review
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

//Route 2 to deleter

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports=router