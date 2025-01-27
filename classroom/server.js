const express=require('express');
const app=express();
const cookieparser=require('cookie-parser');
const session = require('express-session')
app.use(cookieparser("secret code"));


app.use(session({secret:"secretcode",
resave:false,
saveUninitialized:true,
}))


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
app.get("/register",(req,res)=>{
    let {name="anyonomous"}=req.query;
    req.session.name=name;
    console.log(req.session.name);
    
    console.log(req.session);
    res.send(`Welcome ${name}`);
})
app.get("/hello",(req,res)=>{
    res.send(`Welcome ${req.session.name}`);
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