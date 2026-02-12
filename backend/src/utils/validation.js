const validateSignUpData  = (req) =>{
    const {firstName , lastName , emailId, password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("First or last name is missing!");
    }
    else if(firstName.length <=4 || firstName.length >=50){ {
        throw new Error("FirstName should be between 4 to 50 characters!");
    }
    

}
}