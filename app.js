const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


//routes
const listingRouter=require('./routes/listing');
const reviewsRouter=require('./routes/review');
const UserRouter=require('./routes/user');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
passport.use(new LocalStrategy(User.authenticate()));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})


// *********************************************************************************************************************************************
const sessionoption={
    secret:'thisisnotagoodsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
}

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    console.log(res.locals.success.length);
    res.locals.currentuser=req.user
   // console.log(res.locals.success); ye hjumne isliya use kykyuki hum falsh ko jabhoga tabhi use krnege par jaga ha raha tha phir humne sucees print iyat tojh array ha raha tha toh .lenghth likhi agar lenhth nhai hoga nhai dhikygi dega
    next();
})

app.get("/demouser", async (req,res)=>{

    let fakeuser=new User({email:"vivekpandey98100@gmail.com",
         username:"vivek"
        });
       
        

   let registeruser= await User.register(fakeuser,"chicken");
    res.send(registeruser);
});





app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use("/",UserRouter);

 




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
