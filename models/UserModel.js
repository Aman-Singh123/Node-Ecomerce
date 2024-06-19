const mongoose = require('mongoose'); // Erase if already required
const AddressSchema = require('./AddressModel');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
    },
    lastName: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Array,
        default: []
    },
    address: [AddressSchema],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Products' }],
    isblocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('User', userSchema);