const express = require("express");
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();


requestRouter.post('/sendConnectionRequest' , userAuth , async (req , res)=>{
    //Sending a connection request to another user
    console.log("Sending connection request to user with id : ");
    
    res.send("Connection request sent successfully!");
});

module.exports = requestRouter;