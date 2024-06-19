const BlogModel = require('../models/BlogModel')
const UserModel = require('../models/UserModel')
const asynchandler = require('express-async-handler')


class BlogController {
    // create a blog 
    static CreateBlog = asynchandler(async (req, res, next) => {
        try {
            console.log(req.body)
            const { title, description, category } = req.body
            if (title && description && category) {
                const blog = await BlogModel.create({
                    title,
                    description,
                    category,
                    author: {
                        authorId: req.user._id,
                        authorName: `${req.user.firstName}  ${req.user.lastName}`,
                        authorRole: req.user.role || 'admin'
                    }
                })

                res.status(201).json({
                    message: 'Blog created Succesfully',
                    blog
                })
            } else {
                throw new Error("Title description and Category are required")
            }

        } catch (error) {
            console.log("Error in creating Blog", error)
            throw new Error(error)
        }
    })

    // update a blog 

    static updateBlog = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            const { title, description, category } = req.body
            if (title && description && category) {
                const blog = await BlogModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                res.status(200).json({
                    message: 'Blog updated Succesfully',
                    blog
                })
            } else {
                throw new Error("Title description and Category are required")
            }
        } catch (error) {
            console.log("Error in updating Blog", error)
            throw new Error(error)
        }


    })

    // Get a blog

    static getSingleBlog = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            if (id) {
                const blog = await BlogModel.findById(id)
                if (blog) {
                    const updatedBlog = await BlogModel.findByIdAndUpdate(id, {
                        $inc: { numViews: 1 },
                    }, {
                        new: true
                    })
                    res.status(200).json({
                        message: 'Blog is found',
                        updatedBlog
                    })
                } else {
                    throw new Error("Blog is not found for this id ")
                }
            } else {
                throw new Error("Id are required")
            }
        } catch (error) {
            console.log("Error in Getting a  Blog", error)
            throw new Error(error)
        }


    })

    // get all blog

    static getAllBlog = asynchandler(async (req, res, next) => {
        try {
            const blogs = await BlogModel.find()
            res.status(200).json({
                message: 'Blog is found',
                blogs
            })
        } catch (error) {
            console.log("Error in Getting All Blog", error)
            throw new Error(error)
        }
    })
    // delete a blog

    static DeleteBlog = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            if (id) {
                const blog = await BlogModel.findByIdAndDelete(id)
                res.status(200).json({
                    message: 'Blog Deleted Succesfully',
                    blog
                })
            } else {
                throw new Error("Id is required")
            }
        } catch (error) {
            console.log("Error in updating Blog", error)
            throw new Error(error)
        }
    })


    // Like a blog 
    static Likesblog = asynchandler(async (req, res) => {
        try {
            const { blogId } = req.body
            // console.log(blogId)
            const blog = await BlogModel.findById(blogId)
            if (blog) {
                const loginUserID = req.user._id.toString()
                const isLiked = blog?.likes?.find(userId => userId?.toString() === loginUserID)

                console.log("is Liked", isLiked)
                console.log(blog?.disLikes)
                const alreadyDisliked = blog?.disLikes?.find(userId => userId?.toString() === loginUserID)
                console.log("alreay diskile", alreadyDisliked)
                if (alreadyDisliked) {
                    console.log("already")
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        $pull: { disLikes: loginUserID },
                    }, {
                        new: true
                    })
                }
                if (isLiked) {
                    console.log("is liked ")
                    res.status(200).json({
                        message: "liked succesfully",
                        blog
                    })
                    return
                } else {
                    console.log("else working ")
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        $push: { likes: loginUserID },
                    }, {
                        new: true
                    })
                }

                // Fetch the updated blog to send in the response
                const updatedBlog = await BlogModel.findById(blogId)

                const isLikedLength = updatedBlog.likes.length
                const isDisLikedLength = updatedBlog.disLikes.length


                if (isLikedLength != 0) {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isLiked: true
                    }, {
                        new: true
                    })
                } else {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isLiked: false
                    }, {
                        new: true
                    })
                }

                if (isDisLikedLength != 0) {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isDisLiked: true
                    }, {
                        new: true
                    })
                } else {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isDisLiked: false
                    }, {
                        new: true
                    })
                }

                const updatedBlogModel = await BlogModel.findById(blogId)

                res.status(200).json({
                    message: "Liked   successfully",
                    blog: updatedBlogModel
                });
            } else {
                throw new Error('blog not found for this ID')
            }

        } catch (error) {
            console.log("error in like the blog ", error)
            throw new Error(error)
        }
    })


    // DisLike a blog 
    static DisLikesblog = asynchandler(async (req, res) => {
        try {
            const { blogId } = req.body
            // console.log(blogId)
            const blog = await BlogModel.findById(blogId)
            if (blog) {
                const loginUserID = req.user._id.toString()
                const isLiked = blog?.likes?.find(userId => userId?.toString() === loginUserID)

                // console.log("is Liked", isLiked)
                // console.log(blog?.disLikes)
                const alreadyDisliked = blog?.disLikes?.find(userId => userId?.toString() === loginUserID)
                // console.log("alreay diskile", alreadyDisliked)

                if (isLiked) {
                    console.log("already")
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        $pull: { likes: loginUserID },
                    }, {
                        new: true
                    })
                }

                if (alreadyDisliked) {
                    console.log("its already disliked ")
                    res.status(200).json({
                        message: "disliked succesfully",
                        blog
                    })
                    return
                }
                else {
                    console.log("else working ")
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        $push: { disLikes: loginUserID },
                    }, {
                        new: true
                    })
                }

                // Fetch the updated blog to send in the response
                const updatedBlog = await BlogModel.findById(blogId)

                const isLikedLength = updatedBlog.likes.length
                const isDisLikedLength = updatedBlog.disLikes.length
                console.log(isLikedLength)
                console.log(isDisLikedLength)

                if (isLikedLength != 0) {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isLiked: true
                    }, {
                        new: true
                    })
                } else {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isLiked: false
                    }, {
                        new: true
                    })
                }

                if (isDisLikedLength != 0) {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isDisLiked: true
                    }, {
                        new: true
                    })
                } else {
                    const blog = await BlogModel.findByIdAndUpdate(blogId, {
                        isLiked: false
                    }, {
                        new: true
                    })
                }

                const updatedBlogModel = await BlogModel.findById(blogId)

                res.status(200).json({
                    message: 'Dislike succesfully',
                    blog: updatedBlogModel
                });
            } else {
                throw new Error('blog not found for this ID')
            }

        } catch (error) {
            console.log("error in like the blog ", error)
            throw new Error(error)
        }
    })


}


module.exports = BlogController

