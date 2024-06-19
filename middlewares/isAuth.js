
const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')
const asynchandler = require('express-async-handler')

const isAuth = asynchandler(async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEy)
            req.user = await UserModel.findById(userID).select('-password')
            next()
        } catch (error) {
            console.log(error)
            throw new Error('Unauthorized user ')
        }
    }
    if (!token) {
        throw new Error('Token in not prvoided')
    }
})

module.exports = isAuth
