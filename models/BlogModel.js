const mongoose = require('mongoose'); // Erase if already required
const AuthorSchema = require('./AuthorSchema');

// Declare the Schema of the Mongo model


var BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisLiked: {
        type: Boolean,
        default: false
    },
    likes :[{
        type: mongoose.Types.ObjectId,
        ref : 'User'
    }],
    disLikes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    image: {
        type: String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fblog.html&psig=AOvVaw3CKy4bB0r5fixy5xVSj7Jf&ust=1718340512327000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwjahv-v49eGAxVyT2wGHZLMDFgQjRx6BAgAEBM"
    },
    author: AuthorSchema

}, {
    toJSON: {
        virtuals : true
    },
    toObject: {
        vrital : true 
    },
    timestamps: true
});


//Export the model
module.exports = mongoose.model('Blog', BlogSchema);