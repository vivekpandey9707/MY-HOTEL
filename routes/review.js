const express=require('express');
const router=express.Router({ mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const Review = require('../models/review');
const Listing=require('../models/listing');
const {validatereview, isLoggedIn,ireviewauthor}=require("../middleware")

// review route

  

router.post("/",isLoggedIn,validatereview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.params.id);
    
    let listing = await Listing.findById(id);
    let newreview =  new Review(req.body.review);
    newreview.author=req.user._id
    listing.reviews.push(newreview);
    await listing.save();
    await newreview.save();
    req.flash('success','Successfully added a review');
    res.redirect(`/listings/${id}`);
   
}))

// delete review route

router.delete("/:reviewId",isLoggedIn,ireviewauthor, wrapAsync(async (req, res) => {

    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review');
    res.redirect(`/listings/${id}`);
}))

module.exports=router;