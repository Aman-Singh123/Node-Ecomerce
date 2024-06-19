const express = require('express')
const BrandController = require('../controllers/BrandController')
const BrandRouter = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')
const { uploadPhoto, BrandImagesResize } = require('../middlewares/uploadImages')

BrandRouter.post('/createBrand', isAuth, isAdmin, BrandController.AddBrand)
BrandRouter.put('/updateBrand/:id', isAuth, isAdmin, BrandController.UpdateBrand)
BrandRouter.put('/upload/:id', isAuth, isAdmin, uploadPhoto.single('image'), BrandImagesResize, BrandController.uploadImages)
BrandRouter.get('/Brands', isAuth, isAdmin, BrandController.GetAllBrand)
BrandRouter.get('/:id', isAuth, isAdmin, BrandController.GetABrand)
BrandRouter.delete('/:id', isAuth, isAdmin, BrandController.DeleteBrand)


module.exports = BrandRouter