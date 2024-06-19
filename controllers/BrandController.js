const BrandModel = require('../models/BrandModel')
const asynchandler = require('express-async-handler')
const CloudnairyUploadImage = require('../utils/cloudniary')
const fs = require('fs')

class BrandController {
    static AddBrand = asynchandler(async (req, res) => {
        try {
            const { title, image } = req.body
            console.log(title, image)
            if (title && image) {
                const Brand = await BrandModel.create({
                    title,
                    image,
                    createdBy: {
                        authorId: req.user._id,
                        authorName: `${req.user.firstName}  ${req.user.lastName}`,
                        authorRole: req.user.role || 'admin'
                    }
                })
                res.status(201).json({
                    message: 'Brand Added Succesfully',
                    Brand
                })
            } else {
                throw new Error('title and image are required')
            }
        } catch (error) {
            console.log("error in Add Brand", error)
            throw new Error(error)
        }

    })

    static UpdateBrand = asynchandler(async (req, res) => {
        try {
            const { id } = req.params

            const { title, image } = req.body
            if (id) {
                if (title && image) {
                    const Brand = await BrandModel.findByIdAndUpdate(id, req.body, {
                        new: true
                    })
                    if (Brand) {
                        res.status(201).json({
                            message: 'Brand updated Succesfully',
                            Brand
                        })
                    } else {
                        throw new Error('Brand not found for particular id ')
                    }
                } else {
                    throw new Error('title and image are required')
                }
            } else {
                throw new Error('Please provide a id ')
            }
        } catch (error) {
            console.log("error in Add Brand", error)
            throw new Error(error)
        }
    })

    // Get All Brand

    static GetAllBrand = asynchandler(async (req, res) => {
        try {
            const Brandies = await BrandModel.find()
            res.status(201).json({
                message: 'All Brand get Succesfully',
                Brandies
            })
        } catch (error) {
            console.log("error in Add Brand", error)
            throw new Error(error)
        }
    })

    //  get single Brand  

    static GetABrand = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Brand = await BrandModel.findById(id)
                if (Brand) {
                    res.status(201).json({
                        message: ' Brand get Succesfully',
                        Brand
                    })
                } else {
                    throw new Error('Brand is not found for particular id ')
                }
            } else {
                throw new Error('Id is not found ')
            }

        } catch (error) {
            console.log("error in Get Brand", error)
            throw new Error(error)
        }
    })

    // Delete a Brand

    static DeleteBrand = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Brand = await BrandModel.findByIdAndDelete(id)
                if (Brand) {
                    res.status(201).json({
                        message: 'Brand Deleted Succesfully',
                        Brand
                    })
                } else {
                    throw new Error('Brand not found for particular id ')
                }
            } else {
                throw new Error('Please provide a id ')
            }
        } catch (error) {
            console.log("error in Add Brand", error)
            throw new Error(error)
        }
    })


    // upload images

    static uploadImages = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const uploader = async (path) => await CloudnairyUploadImage(path, 'Brands')
                const files = req.file
                const { path } = files
                const newpath = await uploader(path)
                const url = newpath.url
                fs.unlinkSync(path)
                const Brand = await BrandModel.findById(id)
                if (Brand) {
                    const updateImages = await BrandModel.findByIdAndUpdate(id, {
                        image: url
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




module.exports = BrandController