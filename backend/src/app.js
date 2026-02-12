const express = require('express');
const dotenv = require("dotenv");
const User = require('./models/user')
dotenv.config();
const connectDB = require('./config/database');

const app = express();
const port = process.env.PORT || 7777;

app.use(express.json());


app.post('/signup' ,async (req , res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).json({message : "User created successfully"});
    }catch(err){
        console.error(err.message);
        res.status(500).json({message : "Internal server error"});
    }
    
});

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



