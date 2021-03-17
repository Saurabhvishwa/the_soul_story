const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(typeof authHeader === "undefined"){
        res.status(400).json({msg:"Please Log in"});
    }
    const token = authHeader.split(" ")[1];
    if(token === null){
        return res.status(401).json({error:"Token not found"});
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error){
            res.status(403).json(error);
        }else{
            req.user = user;
            next();
        }
    })
}