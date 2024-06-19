const jwt = require('jsonwebtoken')
const RefershToken = (id) => {
    return jwt.sign({ userID: id }, process.env.JWT_SECRET_KEy, { expiresIn: '1d' })
}

module.exports = RefershToken