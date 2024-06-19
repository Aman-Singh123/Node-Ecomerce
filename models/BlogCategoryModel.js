const mongoose = require('mongoose'); // Erase if already required
const AuthorSchema = require('./AuthorSchema');

// Declare the Schema of the Mongo model
var CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    image: {
        type: String,
    },
    createdBy: AuthorSchema
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('BlogCategory', CategorySchema);