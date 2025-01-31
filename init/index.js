const mongoose = require('mongoose');
const data=require('./cama.js');
const Listing=require("../models/listing.js"); 


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err); 
})


const initDB=async()=>{   
    await Listing.deleteMany({});
    data.data=data.data.map((oldprev)=>({...oldprev,owner:'679ba5a00f79c5d45063fce7'}))
    await Listing.insertMany(data.data);
    console.log(data.data);
}
initDB() 

// de