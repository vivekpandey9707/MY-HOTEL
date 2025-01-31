const Listing=require("./models/listing")
const Review=require("./models/review")
const ExpressError=require('./utils/ExpressError');
 // validation schema
const {listingSchema,reviewSchema}=require("./schema");
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;

        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

 // man lo app login nhai ho aur app idhar dusre tab khol rahe  session ki thorugh
    //par jese login hoajye toh passport seesion ki purani history ko delete kardeta hai
    // toh hum jaha jana chat ethe waha nahi ja ppaynge
module.exports.savedRedirectUrl=(req, res, next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
      next()
    }

   //e export alag se use kiy akyukki hume isko use karna tha aur hume isko use karna tha toh humne isko alag se export kiya
   //kyuki passport ise use karne s epehle session ko reset kardega toh purani history nahi milegi

   module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentuser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next()
   }

   module.exports.validateListing= (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
 if (error) {
    let errmsg=error.details.map((el)=>el.message).join(',');
    throw new ExpressError(errmsg, 400);
    
 }else{
     next();
 }
}    

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error) {
       let errmsg=error.details.map((el)=>el.message).join(',');
       throw new ExpressError(errmsg, 400);
       
    }else{
        next();
    }
   


}


module.exports.ireviewauthor=async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentuser._id)){
        req.flash('error', 'You do noi owner of this comment');
        return res.redirect(`/listings/${id}`);
    }
    next()
   }