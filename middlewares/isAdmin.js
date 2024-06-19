const UserModel = require('../models/UserModel')
const asynchandler = require('express-async-handler')

const isAdmin = asynchandler(async (req, res, next) => {
    const { email } = req.user
    try {
        const AdminUser = await UserModel.findOne({ email: email })
        if (AdminUser.role != "admin") {
            res.status(401).json({
                message: 'You are not an admin'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = isAdmin