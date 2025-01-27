const express=require('express');
const router=express.Router({ mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSchema}=require("../schema"); // validation schema
const Review = require('../models/review');
const Listing=require('../models/listing');

// review route
function validatereview(req,res,next){
    let {error}=reviewSchema.validate(req.body);
 if (error) {
    let errmsg=error.details.map((el)=>el.message).join(',');
    throw new ExpressError(errmsg, 400);
    
 }else{
     next();
 }
}

router.post("/",validatereview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.params.id);
    
    let listing = await Listing.findById(id);
    let newreview =  new Review(req.body.review);
    listing.reviews.push(newreview);
    await listing.save();
    await newreview.save();
    res.redirect(`/listings/${id}`);
   
}))

// delete review route

router.delete("/:reviewId", wrapAsync(async (req, res) => {

    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports=router;