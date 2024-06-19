
const mongoose = require('mongoose')

// Define the Author schema
const AuthorSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorRole: {
        type: String,
        default: 'admin'
    }
});


module.exports = AuthorSchema
