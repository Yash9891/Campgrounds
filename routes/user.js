const express=require('express');
const router =express.Router();
const User=require('../models/user');
const passport=require('passport')
const catchAsync=require('../utils/catchAsync')
const users=require('../controllers/users.js')


router.get('/register',users.renderRegister);

const { storeReturnTo } = require('../middleware');


//Route 1 register 
router.post('/register',catchAsync( users.register))

//route 2 login
router.get('/login',users.renderlogin)
router.post('/login',  storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

//route to delete
router.get('/logout', users.logout); 

module.exports=router