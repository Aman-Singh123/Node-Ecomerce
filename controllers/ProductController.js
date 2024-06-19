const ProductModel = require('../models/ProductModel')
const asynchandler = require('express-async-handler')
const slugify = require('slugify')
const UserModel = require('../models/UserModel')
const CloudnairyUploadImage = require('../utils/cloudniary')
const fs = require('fs')
const ProductCategoryModel = require('../models/ProductCategoryModel')


class ProductController {
    // Create a product 
    static CreateProduct = asynchandler(async (req, res, next) => {
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title)
            }


            const category = req.body.category
            if (!category) {
                throw new Error('Category is required');
            }

            const categoryExists = await  ProductCategoryModel.findOne({ title: category });
            if (!categoryExists) {
                throw new Error('Category does not exist');
            }

            const Product = await ProductModel.create(req.body)
            res.status(201).json({
                message: 'Products succesfully created',
                Product: Product
            })
        } catch (error) {
            console.log("Error in Create Product", error)
            throw new Error(error)

        }
    })

    // Get All products

    static GetAllProducts = asynchandler(async (req, res, next) => {
        try {

            // Filtering 

            // Copy the query parameters from the request
            let queryObj = { ...req.query };
            console.log('Initial query object:', queryObj);

            // Fields to exclude from the query
            let excludeFields = ['page', 'sort', 'limit', 'fields'];

            // Remove the excludeFields from the query object
            excludeFields.forEach(field => delete queryObj[field]);

            console.log('Filtered query object:', queryObj);

            // Convert the query object to a string and replace operators with MongoDB syntax
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

            console.log('Query string after replacement:', queryStr);

            // Parse the query string back to an object
            let query = {};
            if (queryStr !== '{}') {
                query = JSON.parse(queryStr);
            }

            console.log('Final query object:', query);

            // sorting

            let sort = "-createdAt"; // Default sorting
            if (req.query.sort) {
                sort = req.query.sort.split(",").join(' ');
            }


            // Field limiting
            let fields = '-__v'; // Default to all fields 
            // and if we add minus this will not give here __v 
            if (req.query.fields) {
                fields = req.query.fields.split(",").join(' ');
            }


            // pagination

            // Pagination


            // const page = parseInt(req.query.page) || 1;
            // const limit = parseInt(req.query.limit) || 10;
            // const skip = (page - 1) * limit;


            // Execute the query
            const products = await ProductModel.find(query).sort(sort).select(fields)
            // .skip(skip).limit(limit);; for pagination if i want to apply 
            // Send the response with the fetched products
            res.status(200).json({
                message: "All products fetched successfully",
                products
            });

        } catch (error) {
            console.log("error in get all Products", error)
            throw new Error(error)
        }
    })

    // get a single products

    static GetSingleProduct = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            console.log(id)
            if (!id) {
                throw new Error('please provide a id for product Details')
            }
            const Product = await ProductModel.findById(id).populate('color')
            if (Product) {
                res.status(200).json({
                    message: " Product fetched Succesfully",
                    Product
                })
            } else {
                throw new Error(`Products not found for this particular id: - ${id} `)
            }
        } catch (error) {
            console.log("Error in get single product")
            throw new Error(error)
        }
    })

    // update a product

    static UpdateaProduct = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            if (!id) {
                throw new Error('Please provide the id before update')
            }
            if (req.body.title) {
                req.body.slug = slugify(req.body.title)
            }
            const Product = await ProductModel.findByIdAndUpdate(id, req.body, {
                new: true
            }
            )
            res.status(200).json({
                message: `product updated Succesfully`,
                Product
            })

        } catch (error) {
            console.log("Error in update Product", error)
            throw new Error(error)
        }


    })


    // Delete a product
    static DeleteSingleProduct = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            if (!id) {
                throw new Error('please provide a id for product Details')

            }
            const Product = await ProductModel.findByIdAndDelete(id)
            if (Product) {
                res.status(200).json({
                    message: " Product Deleted Succesfully",
                    Product
                })
            } else {
                throw new Error(`Products not found for this particular id: - ${id} `)
            }

        } catch (error) {
            console.log("Error in get single product")
            throw new Error(error)
        }
    })

    // Add to Wishlist

    static AddtoWishlist = asynchandler(async (req, res) => {
        const { _id } = req.user
        const { ProdId } = req.body
        try {
            const user = await UserModel.findById(_id)
            if (user) {
                const alreadyAdded = user.wishlist.find(userId => userId.toString() === ProdId)
                if (alreadyAdded) {
                    let user = await UserModel.findByIdAndUpdate(_id, {
                        $pull: { wishlist: ProdId }
                    }, {
                        new: true
                    })
                } else {
                    let user = await UserModel.findByIdAndUpdate(_id, {
                        $push: { wishlist: ProdId }
                    }, {
                        new: true
                    })

                }

                res.status(200).json({
                    message: 'Product Add to wishlist Succesfully',
                    user
                })

            } else {
                throw new Error('User not found ')
            }

        } catch (error) {
            console.log("error in wishlist", error)
            throw new Error(error)
        }
    })


    // Ratings

    static AddRatings = asynchandler(async (req, res) => {
        try {
            const { _id } = req.user
            const { star, comment, ProdId } = req.body
            const product = await ProductModel.findById(ProdId)
            if (product) {
                let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString())
                console.log(alreadyRated)
                if (alreadyRated) {
                    // Update the existing rating
                    const updatedRating = await ProductModel.updateOne(
                        {
                            _id: ProdId,
                            "ratings._id": alreadyRated._id
                        },
                        {
                            $set: {
                                "ratings.$.Star": star,
                                "ratings.$.comment": comment
                            }
                        },
                        {
                            new: true
                        }
                    );
                } else {
                    const Product = await ProductModel.findByIdAndUpdate(ProdId, {
                        $push: {
                            ratings: {
                                Star: star,
                                postedby: _id,
                                comment: comment
                            },
                        },
                    },
                        {
                            new: true
                        })
                }

                const getallRating = await ProductModel.findById(ProdId)
                let totalRating = getallRating.ratings.length
                console.log(totalRating)
                let ratingsSum = getallRating.ratings.map((item) => item.Star).reduce((prev, current) => prev + current, 0)
                console.log(ratingsSum)
                let actualRating = Math.round(ratingsSum / totalRating)
                console.log(actualRating)
                let finalProduct = await ProductModel.findByIdAndUpdate(ProdId, {
                    totalRatings: actualRating
                }, {
                    new: true
                })

                res.status(200).json({
                    message: 'Product Rated Succesfully',
                    finalProduct
                })
            }
            else {
                throw new Error('Products not found for particular id')
            }
        } catch (error) {
            console.log("error in ratings", error)
            throw new Error(error)

        }

    })


    // upload images

    static uploadImages = asynchandler(async (req, res) => {
        try {
            console.log(req.files)
            const { id } = req.params
            if (id) {
                const uploader = async (path) => await CloudnairyUploadImage(path, 'Products')
                const urls = []
                const files = req.files
                for (let file of files) {
                    const { path } = file
                    console.log(path)
                    const newPath = await uploader(path)
                    urls.push(newPath.url)
                    fs.unlinkSync(path)
                }

                const Product = await ProductModel.findById(id)
                if (Product) {
                    const updateImages = await ProductModel.findByIdAndUpdate(id, {
                        images: urls.map(files => {
                            return files
                        })
                    }, {
                        new: true
                    })
                    res.status(200).json({
                        message: 'Images uploaded successfully',
                        updateImages
                    })
                }
                else {
                    throw new Error('Product not found for this id ')
                }
            } else {
                throw new Error('Please provide an id ')
            }

        }
        catch (err) {
            console.log("error in upload imagtes ", err)
            throw new Error(err)
        }
    })








}



module.exports = ProductController