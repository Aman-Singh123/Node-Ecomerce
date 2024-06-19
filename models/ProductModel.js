
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim : true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    description: {
        type: String,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        requied : true,
        trim: true
    },
    category: {
        // use it later
        // type: mongoose.Types.ObjectId,
        // ref : "Category"
        type: String,
        required : true
    },
    brand: {
        type: String,
        // enum: ["Addidas", "Nike", "Rolex", "HP", "Asus" ,"Samsung","Lenovo"]
        required : true
    },
    quantity: {
        type: Number,
        required : true,
        trim: true,
        select: false
    },
    sold: {
        type: Number,
        trim: true,
        default: 0,
        select : false
    },
    images: [],
    color: [{
        type: mongoose.Types.ObjectId,
        ref: 'Colors'
    }],
    tags : [],
    ratings: [{
        Star: Number, 
        comment : String,
        postedby : {type : mongoose.Types.ObjectId, ref : "User"}
    }],
    totalRatings: {
        type: String,
        default : 0
    }
}, {
    timestamps : true
}
)

module.exports = mongoose.model('Products',ProductSchema)
