const CouponModel = require('../models/CouponModel')
const asynchandler = require('express-async-handler')


class CouponController {
    static AddCoupon = asynchandler(async (req, res) => {
        const { title, discount, expiry } = req.body
        try {
            if (title && discount && expiry) {
                const Coupon = await CouponModel.create({
                    title,
                    discount,
                    expiry,
                    createdBy: {
                        authorId: req.user._id,
                        authorName: `${req.user.firstName}  ${req.user.lastName}`,
                        authorRole: req.user.role || 'admin'
                    }
                })
                res.status(201).json({
                    message: 'Coupon Added Succesfully',
                    Coupon
                })
            } else {
                throw new Error(' All fields are required')
            }
        }
        catch (error) {
            console.log("Error in Add Coupon", error)
            throw new Error(error)
        }
    })

    static UpdateCoupon = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Coupon = await CouponModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })

                res.status(200).json({
                    message: "Coupon updated successfully",
                    Coupon
                })
            } else {
                throw new Error('Please provide a id ')
            }

        } catch (error) {
            console.log("Error in updating coupon", error)
        }
    })


    static GetAllCoupon = asynchandler(async (req, res) => {
        try {
            const Coupons = await CouponModel.find()
            if (Coupons) {
                res.status(200).json({
                    message: 'All coupons gets Successfully',
                    Coupons
                })
            }
        } catch (error) {
            console.log("Error in getting All coupon", error)
            throw new Error(error)
        }
    })


    static GetSingleCoupon = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Coupon = await CouponModel.findById(id)
                if (Coupon) {
                    res.status(200).json({
                        message: "Coupon Get Successfully",
                        Coupon
                    })
                } else {
                    throw new Error('No coupon Found for this id ')
                }
            } else {
                throw new Error('Please provide an Id')
            }
        } catch (error) {
            console.log("Error in getting a  coupon", error)
            throw new Error(error)
        }
    })


    static DeleteCoupon = asynchandler(async (req, res) => {
        try {
            const { id } = req.params
            if (id) {
                const Coupon = await CouponModel.findByIdAndDelete(id)
                if (Coupon) {
                    res.status(200).json({
                        message: 'Coupon deleted Succesfully',
                        Coupon
                    })
                } else {
                    throw new Error('Coupon not found for this id ')
                }

            } else {
                throw new Error('Please provide an id')
            }

        } catch (error) {
            console.log("Error in Delete a  coupon", error)
            throw new Error(error)
        }
    })




}



module.exports = CouponController