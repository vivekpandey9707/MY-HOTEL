const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const Listing = require('../models/listing'); // Add this line
 // validation schema
//const Review = require('./models/review');    
const {isLoggedIn,isowner,validateListing}=require('../middleware'); 
const User = require('../models/user');




router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render('listings/index', { listings: listings });
}));


// new route
 router.get("/new", isLoggedIn,(req, res) => {
    console.log(req.user);
    
    
        res.render('listings/new');
        
    });

// show route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:'reviews',
        populate:{
            path:"author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }
    console.log(listing);
    
    res.render('listings/show', {  listing });
    
    }))


//add new listing
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req, res,next) => {
        if(!req.body.listing) throw new ExpressError('Invalid Listing Data',400);
   
      
        let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.owner=req.user._id
    //jo new loisting ka owne rho usme current use rki id honi chyie

    
   //  console.log(result);
    
       await newListing.save();
       req.flash("success", "Successfully made a new listing!");
       res.redirect(`/listings`);
     
       
   
   }))
 //edit route
   router.get("/:id/edit",isLoggedIn,isowner, wrapAsync(async (req, res) => {
    let { id } = req.params;
let listing = await Listing.findById(id);
res.render('listings/edit', {  listing });
}))

//update route
router.put("/:id",isLoggedIn,isowner,validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentuser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
 await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Successfully updated listing!");
 res.redirect(`/listings/${id}`);


}))
//delete route
router.delete("/:id",isLoggedIn,isowner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted listing")
    res.redirect('/listings');
}))
module.exports=router;












































































































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

