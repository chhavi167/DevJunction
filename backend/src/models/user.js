const mongoose = require('mongoose');
const validator = require('validator');
const userScehma = new mongoose.Schema({
    firstName:{
        type : String,
        required : true,
    },
    lastName : {
        type :String,
    },
    emailId : {
        type : String ,
        required : [true,'Email is required'],
        unique : true,
        lowercase : true,
        trim : true,
        Validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id!");
            }
        }
    },
    password : {
        type : String,
        required : true,
    },
    age:{
        type : Number,
        min : 18
    },
    gender:{
        type : String,
        Validate(value){
            if(!["male" , "female" , "others"].includes(value) ){
                throw new Error("Invalid Gender!");
            }
        }
    },
    profileUrl :{
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        Validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL!");
            }
        }
    },
    about:{
        type : String,
    },
    skills : {
        type : [String],
    },
    experience : {
        type : String,
    },
    education : {
        type : String,
    },
    location : {
        type : String,
    },

},{
    timestamps:true
});

const User = mongoose.model('User' , userScehma);

module.exports = User;
