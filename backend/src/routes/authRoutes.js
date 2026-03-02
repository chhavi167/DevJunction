const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const authRouter = express.Router();
const validator = require('validator');

const {validateSignUpData} = require('../utils/validation');
const User = require('../models/user');

const app = express();

authRouter.use(express.json());
authRouter.use(cookieParser());

authRouter.post('/signup' ,async (req , res)=>{
    
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

authRouter.post('/login' , async(req , res)=>{

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
            const token = await user.getJWT();
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



module.exports = authRouter;