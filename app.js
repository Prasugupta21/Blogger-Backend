require("dotenv").config();

const express=require("express");
const path=require('path');
const bodyParser=require("body-parser");
const cookieParser = require("cookie-parser");
const cors=require('cors');

const userRoute=require('./routes/user')
const postRoute=require('./routes/post')
const commentRoute=require('./routes/comment');

const connectDB=require('./connection/db');


const PORT= 8000;

connectDB();
const app=express();
const corsOptions = {
  origin: 'https://blogger-teal-one.vercel.app' , // your frontend URL
  credentials: true,

};


app.use(cookieParser());
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

  



app.use('/',userRoute);

app.use('/posts',postRoute);
app.use('/comments',commentRoute);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(PORT,()=>{
    console.log(`server started on port:${PORT}` )
})
