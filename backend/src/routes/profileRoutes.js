const express = require("express");
const {userAuth} = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get('/profile' , userAuth , async (req , res)=>{
    try{
        const user = req.user;
        console.log("user is : " + user.firstName);
        res.send("User profile data");
    }
    catch(err){
        res.status(401).send("Unauthorized : " + err.message);
    }
    
});

module.exports = profileRouter;