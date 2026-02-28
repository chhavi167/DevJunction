const express = require('express');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const validator = require("validator");


const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const connectDB = require('./config/database');

dotenv.config();


const app = express();
const port = process.env.PORT || 7777;

app.use(express.json());

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
        const existingUser = await User.findOne({emailId : emailId});
        if(!existingUser) throw new Error("User not exist");

        //password check

        const isMatch = await bcrypt.compare(password , existingUser.password);
        console.log(isMatch);
        if(isMatch) res.send("Logged in successfully!");
        else throw new Error("Invalid Credentials");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

app.get('/feed' , async (req , res)=>{
    const data = await User.find({firstName : "Chhavi"});
    console.log(data);
    
    res.send(data);
})

app.delete('/delete/:id' , async (req , res)=>{
    try{
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({message : "User deleted successfully"});
    }catch(err){
        console.error(err.message);
        res.status(500).json({message : "Internal server error"});
    }
    
});

app.patch('/user/:userId' , async(req , res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const allowedUpdates = ["firstName" , "lastName" ,  "password" , "age" , "gender" , "profileUrl" , "about" , "skills" , "experience" , "education" , "location"];
        const requestedUpdates = Object.keys(data);
        const isValidOperation = requestedUpdates.every((update) => allowedUpdates.includes(update));
        if(!isValidOperation){
            throw new Error("cannot Update !!");
        }
        const user = await  User.findByIdAndUpdate({_id : userId} , data,{
            returnDocument : "after",
            runValidators:true
        });
        console.log(user);
        res.send("User updated successfully");
        

        
    }catch(err){
        res.status(400).send("Something went wrong!");
    }
})



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



