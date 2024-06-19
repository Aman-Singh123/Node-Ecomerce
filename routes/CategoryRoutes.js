const express = require('express')
const CategoryRouter = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')
const CategoryController = require('../controllers/CategoryController')
const { CategoryImagesResize, uploadPhoto } = require('../middlewares/uploadImages')


CategoryRouter.post('/AddCategory', isAuth, isAdmin, CategoryController.AddCategory)
CategoryRouter.put('/update/:id', isAuth, isAdmin, CategoryController.UpdateCategory)
CategoryRouter.put('/upload/:id', isAuth, isAdmin, uploadPhoto.single('image'), CategoryImagesResize, CategoryController.uploadImages)
CategoryRouter.get('/categoires', isAuth, isAdmin, CategoryController.GetAllCategory)
CategoryRouter.get('/:id', isAuth, isAdmin, CategoryController.GetACategory)
CategoryRouter.delete('/:id', isAuth, isAdmin, CategoryController.DeleteCategory)




module.exports = CategoryRouter