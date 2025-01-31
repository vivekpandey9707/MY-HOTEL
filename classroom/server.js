const express=require('express');
const app=express();
const cookieparser=require('cookie-parser');
const session = require('express-session')
app.use(cookieparser("secret code"));
const flash=require('connect-flash');
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(session({secret:"secretcode",
resave:false,
saveUninitialized:true,
}))

app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucessmsg=req.flash("error");  // ye jo me direct rende rkiya bina pass kar raha hu template me res.local documentaion se padh aki ye template locally storage ka kaam karta hai
    res.locals.errormsg=req.flash("success");
    next();
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count+=1
    }else{
        req.session.count=1
    } 
    res.send(`you have visited this page ${req.session.count} times`)

})

// app.get("/test",(req,res)=>{
//    // console.log(req.cookies);
//     res.send("hello")
// })
app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    if(name === "anonymous"){
        req.flash("error", "Please provide a name");
    }else{
        req.flash("success", "Successfully registered");
    }
    req.session.name = name;
    
    //redirect karne se pehle ke msg flash ho mane redirect hogya aur ek msg 
    //flash hoga agar redirect jaha udhar reolad hua toh kluch nahi ayega

    console.log(req.session);
    res.redirect("/hello");
  
});

app.get("/hello",(req,res)=>{

    // res.locals.sucessmsg=req.flash("error");  // ye jo me direct rende rkiya bina pass kar raha hu template me res.local documentaion se padh aki ye template locally storage ka kaam karta hai
    // res.locals.errormsg=req.flash("success");
    // res.send(`Welcome ${req.session.name}`);
    res.render("pagge.ejs", { name: req.session.name, msg: req.flash("success") });
    // hum kahi bhi route oe ja kar cokkie ka acces le sakte bahle dusre route e
    //ho tobhi hum usko use kar skate hai
  
  
})



app.listen(3000,()=>{
    console.log("hello guys");
    
})





































































// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
    
//     res.send("hi guys")
// })
// app.get("/users",(req,res)=>{
//     res.send("hi guys")
// })
// app.post("/users/new",(req,res)=>{
//     res.send("hi guys post")
// })
// app.get("/users/:id",(req,res)=>{
//     res.send("hi guys edit")
// })
// app.delete("/users",(req,res)=>{
//     res.send("hi guys delete")
// })

// app.get("/getcookie",(req,res)=>{
//     res.cookie("greet","hello")
//     res.cookie("madeIn","India")
//     res.send("sent you some ookie")
// })

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("greet","hello",{signed:true})
//     res.cookie("madeIn","India",{signed:true})
//     res.send("sent you some signed cookie")
// })

// app.get("/verifycookie",(req,res)=>{
//     console.dir(req.signedCookies);
//     res.send("verified cookie")
// })