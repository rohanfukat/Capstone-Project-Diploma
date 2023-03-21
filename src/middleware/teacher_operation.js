const bcrypt = require("bcrypt");
const teacher = require("../model/teacher_schema.js"); // for accessing teacher's operation from DB
const helper = require("../middleware/Helper");
const random = require('randomstring');
const express = require('express')
const cookie = require("cookie-parser")
const Qrcode = require('qrcode');
const { generate } = require("randomstring");
const app = express();
app.use(cookie());
const flash = require("express-flash");

app.use(flash())

async function register_teacher(req,resp,next){

    try{
        // const hashpassword = await bcrypt.hash(); // do ehile frontend
        const teacher_reg_data =  new teacher.teacher_register_model({
            uniqueid:req.body.teacher_id,
            name:req.body.teacher_name,
            password:req.body.teacher_password,
            role:"teacher",
            mobileno:req.body.teacher_no
        })

        // helper.generateAuthToken(req,resp,next);

        const status = await teacher_reg_data.save();
        console.log(status);
        // next();
        resp.redirect("/login")

    }catch(e)
    {
        // console.log(e) if error is caugth
        var msg = "unique id already present"
        resp.render("register_teacher",{e:msg});
    }
}

async function create_classroom(req,resp,next){

    try{
        const create_class =  new teacher.teacher_classroom_model({
            uniqueid:"999",
            year:"TY",
            discipline:"CO-1",
            semester:"6",
            subject:"MAD",
            stud_capacity:[90],
            roll_range:"1801-1860",
            create_qr_dates:["27/2/2023"],
        })

        const status = await create_class.save();
        console.log(status);
        next()

    }catch(e)
    {
        console.log(e)
    }
}

async function login_teacher_verify(req,resp,next){

    try{
        const unique_id = req.body.teacher_name;
        const password = req.body.teacher_password;

        // console.log(unique_id, password); Printing unique id and password
        const verify_id = await teacher.teacher_register_model.find({uniqueid:unique_id}).select({name:1});

        if(verify_id.length == 0)
        {
            return resp.status(404).send("ID Not Found")
        }

        const verify_password = await teacher.teacher_register_model.find({uniqueid:unique_id}).select({password:1});
        // console.log(verify_password[0].password); printing password 

        
        if(password == verify_password[0].password)
        {
        const token = await helper.generateAuthToken(req,resp,next);
        console.log(typeof(token));

        console.log("Return token : "+token);
        helper.createCookie(req,resp,next,unique_id,token);

        resp.redirect("./teacher_menu")
        }
        else{
            return resp.status(400).send("Incorrect Password")
        }

    }catch(e)
    {
        console.log(e);
    }
}

async function  create_qrcode(req,resp, auth_String)
{
    try{
        Qrcode.toDataURL(auth_String, function(err, QR_code)
        {
            if(err) {return console.log("error occurred")}

            else
            {
                console.log("qr created");
            resp.send("<img src = "+QR_code+" width='1000px' height='1000px'>")
            
            }
        })
        // setTimeout(refresh_qrString.bind(null,data),1000)
        setTimeout(function(){
            refresh_qrString(req)
        },180000)
        
    }catch(e)
    {
        console.log(e)
    }

}



async function create_qr(req, resp, next)
{
        const date = new Date();

    try{
        const year = "TY"
        const discipline = "CO-1"
        const sem = "6"
        const subject = "MAD"

        const random_str = random.generate(7);
        const auth_String = random_str + " "+ year + " " + discipline + " " + sem + " " + subject;
        // console.log(auth_String);

        const data = req.cookies.Teach_data;
        const status = await teacher.teacher_classroom_model.updateMany({uniqueid:data},{
            $set:{
                authString:auth_String,
            },
            $push:{
                create_qr_dates: date.toLocaleDateString() 
            }
        })
        console.log(status);
        create_qrcode(req, resp, auth_String)
        
    }catch(e)
    {
        console.log(e)
    }
}


async function refresh_qrString(req)
{
    try
    {
        const data = req.cookies.data;
        const status = await teacher.teacher_classroom_model.updateOne({uniqueid:data},{
            $set:{
                authString:null
            }
        })
        console.log(status);
    }catch(e)
    {
        console.log(e);
    }
}

module.exports= {register_teacher,create_classroom,login_teacher_verify, create_qr};