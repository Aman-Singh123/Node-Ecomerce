const jwt = require('jsonwebtoken')
const generateToken = (id) => {
   return  jwt.sign({userID : id }, process.env.JWT_SECRET_KEy,{expiresIn : '3d'})
}

module.exports = generateToken