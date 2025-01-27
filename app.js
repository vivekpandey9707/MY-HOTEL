const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const listing=require('./routes/listing');
const reviews=require('./routes/review');




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



app.use('/listings',listing);
app.use('/listings/:id/reviews',reviews);




// review route

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
