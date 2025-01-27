const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const Listing=require('../models/listing'); 
const ExpressError=require('../utils/ExpressError');
const {listingSchema}=require("../schema"); // validation schema
//const Review = require('./models/review');     




function validateListing(req,res,next){
    let {error}=listingSchema.validate(req.body);
 if (error) {
    let errmsg=error.details.map((el)=>el.message).join(',');
    throw new ExpressError(errmsg, 400);
    
 }else{
     next();
 }
}    


router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render('listings/index', { listings: listings });
}));


// new route
 router.get("/new", (req, res) => {
        res.render('listings/new');
        
    });

// show route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show', {  listing });
    
    }))

// app.get("/testlisting",async (req,res)=>{
//     let samplelisting= new Listing({
//         title:"Test Listing",
//         description:"This is a test listing",
//         price:100,
//         location:"Test Location",
//         country:"Test Country"
//     })
//     await samplelisting.save();
//     console.log("Saved a test listing");
//     res.send("Saved a test listing");

// })


// add rout
//dheko problem y hua ki jab /listings/:id banan 
// nih /listings/new banan rae tph problem ho rae hai ki /listings/new ko id samaj raha hai new ko i samja raha hai
//id humsha nih rahga new rout ke niche
//niche exampl diya hu chalga nahi kitna bhi new ko id maan raha hai

// app.get("/listing/new", (req, res) => {
//     res.render('listings/new');
    
// });


//add new listing
router.post("/",validateListing,wrapAsync(async (req, res,next) => {
        if(!req.body.listing) throw new ExpressError('Invalid Listing Data',400);
   
      
        let listing = req.body.listing;
    let newListing = new Listing(listing);
    
   //  console.log(result);
    
       await newListing.save();
       res.redirect(`/listings`);
     
       
   
   }))
 //edit route
   router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
let listing = await Listing.findById(id);
res.render('listings/edit', {  listing });
}))

//update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing) throw new ExpressError('Invalid Listing Data',400);
    let { id } = req.params;
    let listing = req.body.listing;
 await Listing.findByIdAndUpdate(id, {...listing}, { new: true });
 res.redirect(`/listings/${id}`);


}))
//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))
module.exports=router;