const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({ message: process.env.LOGIN_FIRST });
    } 
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
      if(err){
        console.log(err);
        return res.status(401).json({ message: "un authoarized"});
      }
      req.userId = payload.userId;
      next();
    })
  };

