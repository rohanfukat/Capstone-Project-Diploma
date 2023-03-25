const student = require("../model/student_schema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
// const student_model = require("../model/student_schema")
const helper = require("../middleware/Helper")
const student_schema = require("../model/student_schema");
const mongoose = require("mongoose");



async function student_register(req,resp,next)
{
    try{
    const student_reg_data = new student.student_register_model({
        roll_no:req.body.stud_roll,
        Name:req.body.stud_name,
        password:req.body.stud_pass,
        year:req.body.stud_year,
        role:"student",
        discipline:req.body.stud_dept,
        semester:req.body.stud_sem,
        // token:"lsjdfl",
        phone_number:req.body.stud_phone,
    })

    // const student_attendance_model = new mongoose.model("TYCO1",student_schema)
    // console.log(req.body.stud_roll);
    const status = await student_reg_data.save();
    console.log(status)
    resp.render("login",{msg:"Registered Successfully, Please Login to Verify"})
    console.log("Student Registered Successfully");
    }
    catch(e)
    {
        resp.render("register_student",{error:"Roll No. OR Phone number OR Password is already present"})
        console.log(e)
    }
}

async function student_login_verify(req,resp,next)
{
    try{
        const roll = req.body.student_roll;
        const password = req.body.student_password;
        
        const verify_roll = await student.student_register_model.find({roll_no:roll});
        // console.log(verify_roll);

        if(verify_roll.length == 0)
        {
            return resp.render("login",{msg:"ID not found"})
        }

        const verify_password = await student.student_register_model.find({roll_no:roll}).select({password:1,year:1,discipline:1})

        if(password == verify_password[0].password)
        {
            const year = verify_password[0].year;
            const discipline = verify_password[0].discipline;
            const data = req.body.student_roll + " " +year + " " + discipline
            console.log(data);

            const token = await helper.generateAuthToken(req,resp,next);

            console.log("Return token : "+token );
            helper.createCookie_stud(req,resp,next,data,token); // setting cookie in user side

            resp.redirect("./student_menu")
        }
        else{
            return resp.render("login",{error : "Incorrect Password"})
        }

    }catch(e)
    {
        console.log(e);
    }

}

module.exports={student_login_verify,student_register}






