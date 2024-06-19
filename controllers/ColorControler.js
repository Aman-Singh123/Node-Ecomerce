const ColorModel = require('../models/ColorModel')
const asynchandler = require('express-async-handler')
class Colorcontroller {
    static AddColor = asynchandler(async (req, res) => {
        try {
            const { title } = req.body
            if (title) {
                const Color = await ColorModel.create({
                    title,
                    createdBy: {
                        authorId: req.user._id,
                        authorName: `${req.user.firstName}  ${req.user.lastName}`,
                        authorRole: req.user.role || 'admin'
                    }
                })
                res.status(201).json({
                    message: 'Color Added Succesfully',
                    Color
                })
            } else {
                throw new Error('title is  required')
            }
        } catch (error) {
            console.log("error in Add Color", error)
            throw new Error(error)
        }

    })

    static UpdateColor = asynchandler(async (req, res) => {
        try {
            const { id } = req.params

            const { title, image } = req.body
            if (id) {
                if (title) {
                    const Color = await ColorModel.findByIdAndUpdate(id, req.body, {
                        new: true
                    })
                    if (Color) {
                        res.status(201).json({
                            message: 'Color updated Succesfully',
                            Color
                        })
                    } else {
                        throw new Error('Color not found for particular id ')
                    }
                } else {
                    throw new Error('title  is  required')
                }
            } else {
                throw new Error('Please provide a id ')
            }
        } catch (error) {
            console.log("error in Add Color", error)
            throw new Error(error)
        }
    })

    // Get All Color

    static GetAllColor = asynchandler(async (req, res) => {
        try {
            const Colors = await ColorModel.find()
            res.status(201).json({
                message: 'All Color get Succesfully',
                Colors
            })
        } catch (error) {
            console.log("error in Add Color", error)
            throw new Error(error)
        }
    })

    //  get single Color  

    static GetAColor = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Color = await ColorModel.findById(id)
                if (Color) {
                    res.status(201).json({
                        message: ' Color get Succesfully',
                        Color
                    })
                } else {
                    throw new Error('Color is not found for particular id ')
                }
            } else {
                throw new Error('Id is not found ')
            }

        } catch (error) {
            console.log("error in Get Color", error)
            throw new Error(error)
        }
    })

    // Delete a Color

    static DeleteColor = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Color = await ColorModel.findByIdAndDelete(id)
                if (Color) {
                    res.status(201).json({
                        message: 'Color Deleted Succesfully',
                        Color
                    })
                } else {
                    throw new Error('Color not found for particular id ')
                }
            } else {
                throw new Error('Please provide a id ')
            }
        } catch (error) {
            console.log("error in Add Color", error)
            throw new Error(error)
        }
    })

}




module.exports = Colorcontroller