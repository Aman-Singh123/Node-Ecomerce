const BlogCategoryModel = require('../models/BlogCategoryModel')
const asynchandler = require('express-async-handler')
const CloudnairyUploadImage = require('../utils/cloudniary')
const fs = require('fs')

class BlogCategoryController {
    static AddCategory = asynchandler(async (req, res) => {
        try {
            const { title, image } = req.body
            console.log(title, image)
            if (title && image) {
                const Category = await BlogCategoryModel.create({
                    title,
                    image,
                    createdBy: {
                        authorId: req.user._id,
                        authorName: `${req.user.firstName}  ${req.user.lastName}`,
                        authorRole: req.user.role || 'admin'
                    }
                })
                res.status(201).json({
                    message: 'Category Added Succesfully',
                    Category
                })
            } else {
                throw new Error('title and image are required')
            }
        } catch (error) {
            console.log("error in Add category", error)
            throw new Error(error)
        }

    })

    static UpdateCategory = asynchandler(async (req, res) => {
        try {
            const { id } = req.params

            const { title, image } = req.body
            if (id) {
                if (title && image) {
                    const Category = await BlogCategoryModel.findByIdAndUpdate(id, req.body, {
                        new: true
                    })
                    if (Category) {
                        
                        res.status(200).json({
                            message: 'Category updated Succesfully',
                            Category
                        })
                    } else {
                        throw new Error('Not found any Category for this id   ')
                    }
                } else {
                    throw new Error('title and image are required')
                }
            } else {
                throw new Error('Please provide a id ')
            }

        } catch (error) {
            console.log("error in Add category", error)
            throw new Error(error)
        }

    })

    // Get All Category

    static GetAllCategory = asynchandler(async (req, res) => {
        try {
            const Categoryies = await BlogCategoryModel.find()
            res.status(201).json({
                message: 'All Category get Succesfully',
                Categoryies
            })
        } catch (error) {
            console.log("error in Add category", error)
            throw new Error(error)
        }
    })

    //  get single category  

    static GetACategory = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Category = await BlogCategoryModel.findById(id)
                if (Category) {
                    res.status(201).json({
                        message: ' Category get Succesfully',
                        Category
                    })
                } else {
                    throw new Error('Category is not found for particular id ')
                }
            } else {
                throw new Error('Id is not found ')
            }

        } catch (error) {
            console.log("error in Get category", error)
            throw new Error(error)
        }
    })

    // delete

    // Delete a Category

    static DeleteCategory = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Category = await BlogCategoryModel.findByIdAndDelete(id)
                if (Category) {
                    res.status(201).json({
                        message: 'Category Deleted Succesfully',
                        Category
                    })
                } else {
                    throw new Error('Category not found for particular id ')
                }
            } else {
                throw new Error('Please provide a id ')
            }
        } catch (error) {
            console.log("error in Add category", error)
            throw new Error(error)
        }
    })


    static uploadImages = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const uploader = async (path) => await CloudnairyUploadImage(path, 'BlogsCategory')
                const files = req.file
                const { path } = files
                const newpath = await uploader(path)
                const url = newpath.url
                fs.unlinkSync(path)
                const category = await BlogCategoryModel.findById(id)
                if (category) {
                    const updateImages = await BlogCategoryModel.findByIdAndUpdate(id, {
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




module.exports = BlogCategoryController