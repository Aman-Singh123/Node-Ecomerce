const express = require('express')
const BlogController = require('../controllers/BlogController')
const BlogRouter = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')

BlogRouter.post('/createBlog', isAuth, isAdmin, BlogController.CreateBlog)
BlogRouter.put('/updateBlog/:id', isAuth, isAdmin, BlogController.updateBlog)
BlogRouter.get('/blogs', isAuth, isAdmin, BlogController.getAllBlog)
BlogRouter.get('/blog/:id', isAuth, isAdmin, BlogController.getSingleBlog)
BlogRouter.delete('/blog/:id', isAuth, isAdmin, BlogController.DeleteBlog)
BlogRouter.put('/likes', isAuth, BlogController.Likesblog)
BlogRouter.put('/dislike', isAuth, BlogController.DisLikesblog)


module.exports = BlogRouter