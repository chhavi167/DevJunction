const express = require('express');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require('./config/database');

dotenv.config();


const app = express();
const port = process.env.PORT || 7777;

const authRouter = require('./routes/authRoutes');
const profileRouter = require('./routes/profileRoutes');
const requestRouter = require('./routes/requestRoutes');

app.use('/' , authRouter);
app.use('/' , profileRouter);
app.use('/' , requestRouter);

app.use(express.json());
app.use(cookieParser());

app.get("/" , (req , res)=>{
    res.send("DevJunction baceknd is working wellll");
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



