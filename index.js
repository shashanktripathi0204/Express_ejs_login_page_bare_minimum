import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var userAlready = false; //flag put in place to see if the user already exists
var user_name = ''; // user name used bu the user at the time of registering
var user_password = ''; // the password user enters will registring


// database for user's UserName and Password
var database = {"Shashank":1234,"Tail":2345};


app.use(bodyParser.urlencoded({extended:true}));


// function to check if the user already exists
function userAlreadyExist(req,res,next,database){
    if (req.body['UserName'] in database){
        userAlready = true;
    }
    next();
}




// app.use(userAlreadyExists) → is avaliable globally and will be executed everytime a request is generated
app.use(userAlreadyExist);

// starting the file at get location
app.get("/",(req, res)=>{
    res.sendFile(__dirname + "/public/index.html")
});


// this post will redirect us to respected html webpage based on whether the user exists or not
app.post("/submit",(req,res)=>{
    if (req.body['UserName'] in database){
        res.sendFile(__dirname + "/public/index_login.html");
    }
    else{
        res.sendFile(__dirname + "/public/index_register.html");
    }
});

// this will help us in storing the data in the userdata
app.post("/register",(req,res)=>{
    console.log("in /register")
    console.log("entered user name:- "+req.body['UserName']);
    console.log("entered password:- "+ req.body['UserPassword']);
    user_name = req.body['UserName'];
    user_password = req.body['UserPassword'];
    database[user_name] = user_password;
    res.sendFile(__dirname + "/public/index_login.html");
})

// here we will check if the user will go throught to the next web page
app.post("/login",(req,res) =>{
    console.log("in /login")
    console.log("Password in db:- "+ database[req.body['UserName']]);
    console.log("ebntered password:- "+ req.body['UserPassword']);
    // if password matches then rendering a welcome message
    if(database[req.body['UserName']] == req.body['UserPassword']){
        console.log("rendering");
        res.render('index.ejs',
        {
            UserNameShow:req.body['UserName']
        });
    }
    else{
        console.log("wrong password");
        res.sendFile(__dirname + "/public/index_login.html");
    }
})

// to check if the app is listning on the specified port
app.listen(port, ()=>{
    console.log(`App is listning on Port ${port}`)
})