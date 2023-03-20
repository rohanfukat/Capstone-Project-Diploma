const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const student_model = require("../model/student_schema")
const teacher = require("../model/teacher_schema")
const student = require("../model/student_schema")
// const app = require("../index");
const express = require("express");
const app = express();
const cookie = require("cookie-parser")
app.use(cookie())



async function generateAuthToken(req,resp,next)
{
    try{

        if(req.body.teacher_name!=null)
        {
        console.log("Teacher id : "+ req.body.teacher_name)
        const token = await jwt.sign(req.body.teacher_name,"asldfjsadljfdsljfldsjlfdsjfdsldslakjfdsl");
        const setToken = await teacher.teacher_register_model.updateOne({uniqueid:req.body.teacher_name},{
        $set : {token : token}
        })

        console.log("Token : "+token);
        return token

        }


        if(req.body.teacher_name == null)
        {
            console.log("Student roll_no : "+ req.body.student_roll)
            const token = await jwt.sign(req.body.student_roll,"eoiwre0283409dklsjLJDS;LFJASLJFWI3O2");
            const setToken = await student.student_register_model.updateOne({roll_no:req.body.student_roll},{
            $set : {token : token}
        })  

        console.log("Token : "+token);
        return token        
        }  
        }catch(e)
        {
            console.log(e);
        }
        }

async function createCookie(req,resp,next,data,token)
{
    resp.cookie("Teach_data",data,{ expires: new Date(Date.now() + 1000*60*60*24)});

    resp.cookie("Teach_authToken",token,{ expires: new Date(Date.now() + 1000*60*60*24)});

    const cookie = req.cookies.data;
    console.log("Cookie Stored : "+cookie);
    if(cookie) 
        console.log("Cookie set : ",true)
    else
        console.log("Cookie set : ",false)
    
}

async function createCookie_stud(req,resp,next,data,token)
{
    resp.cookie("stud_data",data,{ expires: new Date(Date.now() + 1000*60*60*24)});
    resp.cookie("stud_authToken",token,{ expires: new Date(Date.now() + 1000*60*60*24)});
    const cookie = req.cookies.data;
    // const sep = cookie.split(" ");
    // console.log("Cookie : "+sep[1]);
    if(cookie)
        console.log("Cookie set : ",true)
    else
        console.log("Cookie set : ",false)
}

async function redirect_user(req,resp,next)
{
    try{
    if(req.cookies.stud_data && req.cookies.stud_authToken)
    {
        const Student_data = req.cookies.stud_data;
        const data = Student_data.split(" ");
        const stud_db_token = await student.student_register_model.find({roll_no:data[0]}).select({token:1});
    // console.log(stud_db_token) printing token from db

        if(req.cookies.stud_authToken==stud_db_token[0].token)
        {
            resp.redirect("./Student_menu");
            console.log("Student Redirected Successfully")
            return
        }
        else{   next()  }

    
    }


    if(req.cookies.Teach_data && req.cookies.Teach_authToken)
    {

        const Teacher_data = req.cookies.Teach_data;
        const getTeacher = await teacher.teacher_register_model.find({uniqueid:Teacher_data}).select({token:1})
        console.log(getTeacher);

            if(req.cookies.Teach_authToken == getTeacher[0].token)
            {
                resp.redirect("./teacher_menu")
                console.log("Teacher Redirected Successfully")
                return 
            }
            else{       next()      }
            
    } else{     next()      }
        }
        catch(error)
        {
            console.log("Error",error)
        }

}


async function  authorize_user(req,resp,next)
{
    try{

        if(req.cookies.stud_data)
        {
            const stud_data = (req.cookies.stud_data).split(" ")
            const roll_no = stud_data[0];

            const student_data = await student.student_register_model.find({roll_no:roll_no}).select({role:1})
            console.log(student_data);

            if(student_data[0].role != "student")
            {
                resp.send("You are not authorized");
            }
        }

        if(req.cookies.Teach_data)
        {
            const teacher_data = await teacher.teacher_register_model.find({uniqueid:req.cookies.Teach_data}).select({role:1})
            console.log(teacher_data[0].role);

            if(teacher_data[0].role != "teacher")
            {
                resp.send("You are not authorized");               
            }
        }else(next())

    }
    catch(e)
    {
        console.log(e)
    }
}

module.exports={generateAuthToken,createCookie,createCookie_stud,redirect_user,authorize_user};