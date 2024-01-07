const express=require('express');
const router =express.Router();
const Campground=require('../models/campground')
//error handling

const catchAsync=require('../utils/catchAsync')

const {isLoggedIn,isAuthor,validateCampground}=require('../middleware.js')
const campgrounds=require('../controllers/campgrounds.js')

//image upload
const multer=require('multer')

const {storage}=require('../cloudinary')
const upload=multer({storage})


//Route1 to show all campgrounds
router.get('/', catchAsync(campgrounds.index))

//Route 2 to create new campground and render the form from new.ejs
router.get('/new', isLoggedIn,campgrounds.renderNewForm)
//Route 3 to create new campground and submit the form
router.post('/',isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createCampgound))
// router.post('/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files);
//     res.send("hoii")
// })

//Route 4 to show more details abour particular campground
router.get('/:id',catchAsync(campgrounds.showCampground))


//Route 5 to edit the campgrounds
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))
//Route 6 to submit the edit form
router.put('/:id',isLoggedIn,upload.array('image'),validateCampground,isAuthor, catchAsync(campgrounds.updateCampground));

//Route 7 to delete
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports=router;
