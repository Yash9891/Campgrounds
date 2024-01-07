//joi
const { campgroundSchema,reviewSchema  } = require('./schemas.js');
const ExpressError=require('./utils/ExpressError.js')
const Campground=require('./models/campground')
const Review=require('./models/review')
module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error',"You must be signed in")
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//validating using joi on server side
module.exports.validateCampground=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}
//middle ware
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id)
    if (!campground.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
//middle ware
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

//validating using joi on server side

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}