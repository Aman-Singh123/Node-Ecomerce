const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema(
    {
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products"
            },
            count: Number,
            color: String

        }
    ],
    PaymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"]
    },
    OrderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}
    , {
        timestamps: true
    });

//Export the model
module.exports = mongoose.model('Order', OrderSchema);