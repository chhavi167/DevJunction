const validator = require('validator');
const validateSignUpData  = (req) =>{
    const {firstName , lastName , emailId, password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("First or last name is missing!");
    }
    else if(firstName.length <=4 || firstName.length >=50){ {
        throw new Error("FirstName should be between 4 to 50 characters!");
    }
}
    else if(!validator.isEmail(emailId)) {
            throw new Error("Email is not valid!");
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol!");
    }

}

module.exports = {
    validateSignUpData
};