const mongoose = require("mongoose");

const teacher_register_schema = new mongoose.Schema({
    uniqueid:{
        type:String,
        unique:true
    },
    name:String,
    password:{
        type:String,
        unique:true
    },
    role:String,
    token:String,
    mobileno:Number
});

const teacher_register_model= new mongoose.model("Teacher_Register",teacher_register_schema);

const teacher_classroom_schema = new mongoose.Schema({
    uniqueid:{
        type :String,
        // unique:true  // throwing error of typecasting
    },
    year:String,
    role:String,
    discipline:String,
    semester:String,
    subject:String,
    stud_capacity:Array,
    roll_range:String,
    create_qr_dates:Array,
    authString:{
        type:String,
        expires:5000
    }
});


const teacher_classroom_model = new mongoose.model("Teacher_classroom",teacher_classroom_schema);

module.exports = {teacher_register_model,teacher_classroom_model};