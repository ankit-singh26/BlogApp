const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({message: "Authorization header not found"})
    }

    const token = authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({message: "Token not found"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JET_SECRET)
        req.user = { id: decoded.id }
        next()
    }catch(err){
        return res.status(401).json({message: "Invalid token"})
    }
};