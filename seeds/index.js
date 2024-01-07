const Campground=require('../models/campground')
const cities =require('./cities')//import citie.js
const {places,descriptors}=require('./seedHelpers') //import seedHelpers

//mongoose connection
const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Data base Connected");
})

//use seed helpers array 
// Revised sample() function to return a value
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const seedDB= async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'65890c39a50a6511e9b3f1fa',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,

            description:"This is the best place for camping. We provides the best facilities during your camping and make your camping amazing and excited.",
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/df4avy1r0/image/upload/v1704166953/YelpCamp/lhlalvmjvm5d19is4o2h.jpg',
                  filename: 'YelpCamp/lhlalvmjvm5d19is4o2h',

                }
              ],
           
            //after adding this run (node seeds/index.js)
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})