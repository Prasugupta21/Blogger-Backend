require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res,next) => {
 
  const token = req?.cookies?.token;
  console.log('token is ',token);
  if (!token) {
    return res.json({ status: false,message:'Unauthorized' })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false,message:'error in verfication of token UnAuthorized' });
    }
      
      req.user=data;

      next();
    
})}



