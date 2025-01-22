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
    await Listing.insertMany(data.data);
    console.log(data.data);
}
initDB() 

// de