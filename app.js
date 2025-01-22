const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing'); 
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const listingSchema=require("./schema");




app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})



app.get('/',(req,res)=>{
    res.send("Hello World");
})
function validateListing(req,res,next){
    let {error}=listingSchema.validate(req.body);
 if (error) {
    let errmsg=error.details.map((el)=>el.message).join(',');
    throw new ExpressError(errmsg, 400);
    
 }else{
     next();
 }
}

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

app.get("/listings", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render('listings/index', { listings: listings });
}));


// new route
 app.get("/listings/new", (req, res) => {
        res.render('listings/new');
        
    });
// add rout

app.post("/listings",validateListing,wrapAsync(async (req, res,next) => {
     if(!req.body.listing) throw new ExpressError('Invalid Listing Data',400);

   
     let listing = req.body.listing;
 let newListing = new Listing(listing);
 
 console.log(result);
 
    await newListing.save();
    res.redirect(`/listings`);
  
    

}))






// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {

let { id } = req.params;
let listing = await Listing.findById(id);
res.render('listings/show', {  listing });

}))

//dheko problem y hua ki jab /listings/:id banan 
// nih /listings/new banan rae tph problem ho rae hai ki /listings/new ko id samaj raha hai new ko i samja raha hai
//id humsha nih rahga new rout ke niche
//niche exampl diya hu chalga nahi kitna bhi new ko id maan raha hai

// app.get("/listing/new", (req, res) => {
//     res.render('listings/new');
    
// });

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
let listing = await Listing.findById(id);
res.render('listings/edit', {  listing });
}))

app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing) throw new ExpressError('Invalid Listing Data',400);
    let { id } = req.params;
    let listing = req.body.listing;
 await Listing.findByIdAndUpdate(id, {...listing}, { new: true });
 res.redirect(`/listings/${id}`);


}))

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found!',404));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    // res.status(404).send("Page Not Found");
    res.status(statusCode).render("listings/error.ejs",{err});
})


app.listen(8080,()=>{
    console.log("Server is running on port 8080");
    
})