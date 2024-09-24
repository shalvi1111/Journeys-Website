const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then( () => {
    console.log("DB is connected" );
})
.catch(err => console.log(err));

async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async () =>{
    await Listing.deleteMany( {});
    initData.data = initData.data.map( (obj)=>({...obj , owner : "66b3a74bb0efb29dddf53c76"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();
