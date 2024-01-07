//secret
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const mongoSanitize = require('express-mongo-sanitize');
console.log(process.env.SECRET);
const express= require('express');
const app= express();
const path=require('path')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate') //for ejs layout
const helmet =require('helmet')
//Authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//require flash
const flash=require('connect-flash')

//requiring user routes
const userRoutes=require('./routes/user.js')
//requireing campground routes
const campgroundsRoutes=require('./routes/campground.js')

//requireing review routes
const reviewsRoutes=require('./routes/reviews.js')

const Campground=require('./models/campground')
//mongoose connection
const mongoose=require('mongoose');
const ExpressError = require('./utils/ExpressError');

//session require
const session=require('express-session');
const MongoDBStore = require('connect-mongo');
// mongodb://127.0.0.1:27017/yelp-camp



const dbUrl=process.env.DATABASE || "mongodb://127.0.0.1:27017/yelp-camp"
mongoose.connect(dbUrl);
const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Data base Connected");
}) 

app.engine('ejs',ejsMate)//for ejs layout
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))//parse the request body
app.use(methodOverride('_method'))

//to use static files
app.use(express.static(path.join(__dirname,'public')))

//sanitize
app.use(mongoSanitize())

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    mongooseConnection: mongoose.connection,
    secret: 'thisisthesecret',
    touchAfter: 24 * 60 * 60, // Adjust as needed
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

//to use session
const sessionConfig={
    store,
    name:'session',
    secret:'thisisthesecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
//flash
app.use(flash());

// app.use(helmet({contentSecurityPolicy:false}))
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css", 
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],

            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/df4avy1r0/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//Authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())//how to store user
passport.deserializeUser(User.deserializeUser())//how to unstore user

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);

//routes for campgrounds
app.use('/campgrounds',campgroundsRoutes)

//Routes for review
app.use('/campgrounds/:id/reviews',reviewsRoutes)


//Authentication routes
app.get('/fakeUser',async(req,res)=>{
    const user=new User({email:'colt@gmail.com',username:'colt'})
    const newUser=await User.register(user,'chiken');
    res.send(newUser)
})

//home
app.get('/',(req,res)=>{
    res.render('home')
})

//Installation
//for ejs layout install (npm i ejs-mate) in git bash
//for error handling install joi(npm i joi)

//error handling
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page NOT FOUND',404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})