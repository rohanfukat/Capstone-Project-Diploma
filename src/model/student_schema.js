const mongoose = require('mongoose');

const student_register_schema = new mongoose.Schema({
    roll_no:{
        type:String,
        //unique:true
    },
    Name:{
        type:String
    },
    password:String,
    year:String,
    role:String,
    discipline:String,
    semester:String,
    token:String,
    phone_number:Number
})

const student_register_model = new mongoose.model("Student_Register",student_register_schema)

const student_attendance_schema = new mongoose.Schema({
    roll_no:{
        type:String
    },
    year:String,
    discipline:String,
    student_attendance:Array,
})

const student_attendance_model = new mongoose.model("Student_Attendance",student_attendance_schema)

module.exports = {student_register_model,student_attendance_model}