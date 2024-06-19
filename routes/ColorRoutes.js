const express = require('express')
const ColorControllers = require('../controllers/ColorControler')
const ColorRouter = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')

ColorRouter.post('/createColor', isAuth, isAdmin, ColorControllers.AddColor)
ColorRouter.put('/updateColor/:id', isAuth, isAdmin, ColorControllers.UpdateColor)
ColorRouter.get('/Colors', isAuth, isAdmin, ColorControllers.GetAllColor)
ColorRouter.get('/:id', isAuth, isAdmin, ColorControllers.GetAColor)
ColorRouter.delete('/:id', isAuth, isAdmin, ColorControllers.DeleteColor)


module.exports = ColorRouter