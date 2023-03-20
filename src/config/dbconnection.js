const mongoose = require("mongoose");
const mongodb_url = "mongodb://0.0.0.0:27017/Computer_Dept";


mongoose.set('strictQuery',false);

const dbconnection = mongoose.connect(mongodb_url,(err)=>{
    if(err) console.log(`unable to connect to server : ${err}`)
    else
    console.log("Connected Successfully to Database");
})

module.exports=dbconnection;