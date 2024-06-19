const express = require('express')
const CouponRouter = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')
const CouponController = require('../controllers/CouponController')
CouponRouter.post('/AddCoupon', isAuth, isAdmin, CouponController.AddCoupon)
CouponRouter.put('/updateCoupon/:id', isAuth, isAdmin, CouponController.UpdateCoupon)
CouponRouter.get('/', isAuth, isAdmin, CouponController.GetAllCoupon)
CouponRouter.get('/:id', isAuth, isAdmin, CouponController.GetSingleCoupon)
CouponRouter.delete('/:id', isAuth, isAdmin, CouponController.DeleteCoupon)

module.exports = CouponRouter