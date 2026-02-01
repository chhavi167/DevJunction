const express = require('express');
const app = express();
const port = process.env.PORT || 7777;

app.get('/' , (req , res)=>{
    res.send('devJunctin backend server is running');
})

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
});