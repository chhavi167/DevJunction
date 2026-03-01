const express = require('express');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require('./middlewares/auth');
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const connectDB = require('./config/database');

dotenv.config();


const app = express();
const port = process.env.PORT || 7777;

app.use(express.json());
app.use(cookieParser());

app.get("/" , (req , res)=>{
    res.send("DevJunction baceknd is working wellll");
})

app.post('/signup' ,async (req , res)=>{
    
    try{
        //validate input data
        validateSignUpData(req);

        //encrypting the password
        const {firstName , lastName , emailId ,password} = req.body;
        const passwordHash = await bcrypt.hash(password ,10 );
        console.log(passwordHash);
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash
        });
        await user.save();
        const token = await user.getJWT();
        res.cookie("token" , token);
        res.status(201).json({message : "User created successfully"});
    }catch(err){
        console.error(err.message);
        res.status(400).send("ERROR : " + err.message);
    }
    
});

app.post('/login' , async(req , res)=>{

    try{
        const {emailId , password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Credentials");
        }
        const user = await User.findOne({emailId : emailId});
        if(!user) throw new Error("User not exist");

        //password check
        const isMatch = await user.isPasswordMatch(password);
        console.log(isMatch);
        if(isMatch) {
            //JWT Token creation
            const token = await User.getJWT();
            //Add the token to cookie and send response  back to the user
                res.cookie("token" , token);
            res.send("Logged in successfully!");
        }
        else throw new Error("Invalid Credentials");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

app.get('/profile' , userAuth , async (req , res)=>{
    try{
        const user = req.user;
        console.log("user is : " + user.firstName);
        res.send("User profile data");
    }
    catch(err){
        res.status(401).send("Unauthorized : " + err.message);
    }
    
});

app.post('/sendConnectionRequest' , userAuth , async (req , res)=>{
    //Sending a connection request to another user
    console.log("Sending connection request to user with id : ");
    
    res.send("Connection request sent successfully!");
});



connectDB()
.then(()=>{
    app.listen(port , ()=>{
        console.log(`Server is running on port ${port}`);
    });
}
)
.catch ((err) => {
    console.log(err);
    
});



