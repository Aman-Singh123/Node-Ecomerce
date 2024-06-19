const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
    // Add other fields as needed
});


module.exports = AddressSchema;