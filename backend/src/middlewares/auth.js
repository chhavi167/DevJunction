const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req , res , next) => { 
    try{
         //Read the token from request cookies
    const cookie = req.cookies;
    const {token} = cookie;
    if(!token) throw new Error("Token not found in cookies");

    //validate the token and find if the user exists in database
    const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY);
    const {userId} = decodedToken;
    const user = await User.findById(userId);

    if(!user) throw new Error("User not found");
    req.user = user;
    next();
    
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
   
}

module.exports = {
    userAuth,
};