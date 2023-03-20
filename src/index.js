const express = require("express");
const app = express();
const port = 7777;
require("./config/dbconnection");
const teacher = require("./middleware/teacher_operation")
const path = require("path");
const student = require("./middleware/student_operation")
app.use(express.urlencoded({extended: true}));
const helper = require("./middleware/Helper")
const session = require("express-session");



const cookie = require("cookie-parser")
// const helper = require("./middleware/Helper")

//using cookies
// app.use(cookie);

//setting view engine EJS
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.engine('html', require('ejs').renderFile);

// for body parsing
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        data:"hello",
      secure: false,
      maxAge: 3600000 // session expires after 1 hour
    }
  }));
app.use(cookie())

app.listen(port,()=>{
    console.log(`App successfully listening on ${port}`)
})


app.get("/welcome",(req,resp)=>{
    resp.render("welcome")
})


app.get("/login_display",(req,resp)=>{
    resp.render("login")
})

app.get("/login",[helper.redirect_user],(req,resp)=>{
    resp.render("login");
})

app.post("/login_teacher",teacher.login_teacher_verify,(req,resp,next)=>{
    resp.redirect("teacher_menu")
})

app.get("/create_qr",[teacher.create_qr],(req,resp)=>{
    
})

app.get("/get_auth",[helper.authorize_user],(req,resp)=>{

})

// app.get("/",(req,resp)=>{
//     resp.send("hello");
// })

// app.get("/student_register",[student.student_create],(req,resp)=>{
//     resp.send("Student Registered Successfully")
// })

app.post("/student_login",[student.student_login_verify],(req,resp)=>{
    // resp.send("Student Logged In Successfully")
    // resp.send("cookie");
})

app.get("/student_menu",(req,resp)=>{
    resp.render("student_menu")
})

app.get("/teacher_menu",(req,resp)=>{
    resp.render("teacher_menu")
})

app.get("/student_register", async(req,resp)=>{
    resp.render("register_student");
})

app.post("/student_register",student.student_register,async(req,resp)=>{
    resp.send("Student Registered Successfully")
})


app.get("/teacher_login",(req,resp)=>{

})

app.post("/teacher_login",(req,resp)=>{
    
})

app.get("/register_teacher",(req,resp,next)=>{
    resp.render("register_teacher")
})

app.post("/register_teacher",[teacher.register_teacher],(req,resp,next)=>{
    resp.send("Register Successfully");
})

app.get("/create_classroom",[teacher.create_classroom],(req,resp,next)=>{
    resp.send("Classroom created successfully")
})

app.get("/login_teacher",[teacher.login_teacher_verify],(req,resp,next)=>{
    resp.send("Login successfull");
})




module.exports = {app}