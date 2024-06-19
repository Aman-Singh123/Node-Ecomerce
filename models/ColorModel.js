const mongoose = require('mongoose'); // Erase if already required
const AuthorSchema = require('./AuthorSchema');

// Declare the Schema of the Mongo model
var ColorsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    createdBy: AuthorSchema
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Colors', ColorsSchema);