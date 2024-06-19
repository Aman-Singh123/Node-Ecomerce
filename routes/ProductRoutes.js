const express = require('express')
const ProductRouter = express.Router()
const ProductController = require('../controllers/ProductController')
const isAdmin = require('../middlewares/isAdmin')
const isAuth = require('../middlewares/isAuth')
const { uploadPhoto, productImagesResize } = require('../middlewares/uploadImages')

ProductRouter.post('/createProduct', isAuth, isAdmin, ProductController.CreateProduct)
ProductRouter.get('/getAllProduct', isAuth, isAdmin, ProductController.GetAllProducts)
ProductRouter.put('/upload/:id', isAuth, isAdmin, uploadPhoto.array('images', 10), productImagesResize, ProductController.uploadImages)
ProductRouter.put('/wishlist', isAuth, ProductController.AddtoWishlist)
ProductRouter.put('/rating', isAuth, ProductController.AddRatings)
ProductRouter.get('/:id', isAuth, isAdmin, ProductController.GetSingleProduct)
ProductRouter.put('/:id', isAuth, isAdmin, ProductController.UpdateaProduct)
ProductRouter.delete('/:id', isAuth, isAdmin, ProductController.DeleteSingleProduct)





module.exports = ProductRouter