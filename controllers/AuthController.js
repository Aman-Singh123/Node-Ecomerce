const UserModel = require('../models/UserModel')
const { validationResult } = require('express-validator')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const generateToken = require('../config/jsonToken')
const RefershToken = require('../config/refershToken')
const jwt = require('jsonwebtoken')
const ProductModel = require('../models/ProductModel')
const CartModel = require('../models/CartModel')
const CouponModel = require('../models/CouponModel')
const OrderModel = require('../models/OrderModel')
const uniqid = require('uniqid');


class UserController {
    static CreateUser = asynchandler(async (req, res, next) => {
        const { firstName, lastName, email, password, mobile, role } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.status(420).json({
                message: error.errors[0].msg
            })
            return
        }
        const user = await UserModel.findOne({ email: email })
        if (user) {
            throw new Error('This email is already registered')
        } else {
            if (firstName && lastName && email && password && mobile) {
                try {
                    const hashpassword = await bcrypt.hash(password, 12)
                    const User = new UserModel({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: hashpassword,
                        mobile: mobile,
                        role: role
                    })
                    await User.save()
                    // const Saved_User = await UserModel.findOne({ email: email })
                    // let token
                    // if (Saved_User) {
                    //     token = jwt.sign({ userID: Saved_User._id }, process.env.JWT_SECRET_KEy, { expiresIn: '2d' })
                    // }
                    res.status(201).json({
                        message: `${firstName} ${lastName} is created Succesfully`,
                        user: User,
                        // token: token
                    })
                } catch (error) {

                    throw new Error('An Error Occured in Registration ')
                }
            } else {
                throw new Error('All field are required')
            }
        }
    })

    static UserLogin = asynchandler(async (req, res, next) => {
        console.log("login working")
        const { email, password } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.status(420).json({
                message: error.errors[0].msg
            })
            return
        }

        if (email && password) {
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const decrypass = await bcrypt.compare(password, user.password)
                if (!decrypass) {
                    throw new Error('Password is wrong')
                }
                if ((user.email === email) && decrypass) {
                    // const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEy, { expiresIn: '2d' })
                    let token = generateToken(user._id.toString())
                    let refershtoken = RefershToken(user._id.toString())
                    const updateUser = await UserModel.findByIdAndUpdate(user._id.toString(), {
                        refreshToken: refershtoken
                    }, {
                        new: true
                    })
                    res.cookie('refreshToken', refershtoken, {
                        httpOnly: true,
                        maxAge: 72 * 60 * 60 * 1000
                    })
                    res.status(200).json({
                        message: 'Login Succesfully',
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email,
                        mobile: user.mobile,
                        token
                    })
                } else {
                    throw new Error(`email and Password is not valid`)

                }

            } else {
                throw new Error(`This email is not registered`)

            }
        } else {
            throw new Error('Email and Password are required')
        }
    })


    // Admin Login

    static AdminLogin = asynchandler(async (req, res, next) => {
        const { email, password } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.status(420).json({
                message: error.errors[0].msg
            })
            return
        }
        if (email && password) {
            const Admin = await UserModel.findOne({ email: email })
            if (Admin) {
                if (Admin.role !== 'admin') throw new Error('Not Authorized')
                const decrypass = await bcrypt.compare(password, Admin.password)
                if (!decrypass) {
                    throw new Error('Password is wrong')
                }
                if ((Admin.email === email) && decrypass) {
                    // const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEy, { expiresIn: '2d' })
                    let token = generateToken(Admin._id.toString())
                    let refershtoken = RefershToken(Admin._id.toString())
                    const updateUser = await UserModel.findByIdAndUpdate(user._id.toString(), {
                        refreshToken: refershtoken
                    }, {
                        new: true
                    })
                    res.cookie('refreshToken', refershtoken, {
                        httpOnly: true,
                        maxAge: 72 * 60 * 60 * 1000
                    })
                    res.status(200).json({
                        message: 'Login Succesfully',
                        firstName: Admin.firstName,
                        lastName: Admin.lastName,
                        email,
                        mobile: Admin.mobile,
                        token
                    })
                } else {
                    throw new Error(`email and Password is not valid`)

                }

            } else {
                throw new Error(`This email is not registered`)

            }
        } else {
            throw new Error('Email and Password are required')
        }
    })

    // Add Address

    static AddAddress = asynchandler(async (req, res) => {
        const { _id } = req.user
        const { street, city, state, postalCode } = req.body;
        try {
            if (_id) {

                if (street && city && state && postalCode) {
                    const user = await UserModel.findById(_id);
                    if (!user) {
                        throw new Error('User not found');
                    }

                    // Add the new address to the user's addresses array
                    user.address.push({ street, city, state, postalCode });
                    await user.save();
                    res.status(200).json({
                        message: 'Address added to user successfully',
                        user: user
                    });
                } else {
                    throw new Error("All field are Required")
                }
            } else {
                throw new Error("Please provide an id ")
            }
        } catch (error) {
            console.log("Error in Add Address", error)
            throw new Error(error)
        }

    })




    // Handle Refersh Token

    static RefershTokenHandler = asynchandler(async (req, res) => {
        console.log("Handler is being called");
        const cookies = req.cookies;
        console.log("Cookies:", cookies);
        if (!cookies?.refreshToken) {
            console.log("No Refresh token in Cookies");
            throw new Error('No Refresh token in Cookies');
        }
        const refreshToken = cookies.refreshToken;
        console.log("Refresh token:", refreshToken);

        const user = await UserModel.findOne({ refreshToken });
        if (!user) {
            console.log("No refresh token present in DB");
            throw new Error('No refresh token present in db');
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err || user._id.toString() !== decoded.userID) {
                console.log("Error verifying refresh token");
                throw new Error('There is something wrong with refresh token');
            }
            const accessToken = generateToken(user._id.toString());
            res.json({ accessToken });
        });
    });

    // update a User

    static UpdateUser = asynchandler(async (req, res, next) => {
        console.log("update working")
        const { _id } = req.user
        const { firstName, lastName, email, mobile } = req.body
        try {
            if (firstName && lastName && email && mobile) {
                let updateUser = await UserModel.findByIdAndUpdate(_id, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    mobile: mobile
                }, {
                    new: true
                })
                res.status(200).json({
                    message: `${updateUser.firstName + ' ' + updateUser.lastName} is updated successfully `,
                    updatedUser: updateUser
                })
            } else {
                throw new Error('All fields are  required')
            }
        } catch (error) {
            console.log(error)
            throw new Error('Error in update User')
        }
    })




    static LogOutUser = asynchandler(async (req, res, next) => {
        console.log("this is working")
        const cokkie = req.cookies
        console.log(cokkie)
        if (!cokkie?.refreshToken) throw new Error('No Refersh token in Cookies')
        const refreshtoken = cokkie.refreshToken
        console.log(refreshtoken)
        const user = await UserModel.findOne({ refreshToken: refreshtoken })
        console.log(user)
        if (!user) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true
            })
            res.status(204)
        }
        await UserModel.findByIdAndUpdate(user._id.toString(), {
            refreshToken: ""
        })
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        res.sendStatus(204)
    })


    // save Address of User

    static SaveUserAddress = asynchandler(async (req, res, next) => {
        const { _id } = req.user
        try {
            let updateUser = await UserModel.findByIdAndUpdate(_id, {
                address: req?.body?.address
            }, {
                new: true
            })
            res.status(200).json({
                message: `${updateUser.firstName + ' ' + updateUser.lastName} is updated successfully `,
                updatedUser: updateUser
            })
        }
        catch (error) {
            console.log(error)
            throw new Error('Error in update User')
        }


    })






    // get all users

    static getAllUSers = asynchandler(async (req, res, next) => {
        try {
            const AllUsers = await UserModel.find({ role: 'user' })
            res.status(200).json({
                message: 'All user Fetch Succesfully',
                Users: AllUsers
            })
        } catch (error) {
            console.log("error in get all users", error)
            throw new Error('Error in get All Users')
        }
    })

    // get single 

    static getSingleUser = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            const User = await UserModel.findById(id)
            res.status(200).json({
                message: `${User.firstName + ' ' + User.lastName} Fetch Succesfully`,
                User
            })
        } catch (error) {
            console.log("error in get all users", error)
            throw new Error('Error in get Single User')
        }
    })
    // Delete user 
    static DeleteSingleUser = asynchandler(async (req, res, next) => {
        try {
            const { id } = req.params
            const User = await UserModel.findByIdAndDelete(id)
            res.status(200).json({
                message: `${User.firstName + ' ' + User.lastName} Deleted Succesfully`,
                deletedUser: User
            })
        } catch (error) {
            console.log("error in get all users", error)
            throw new Error('Error in Delete  Users')
        }
    })

    // block a user

    static BlockUser = asynchandler(async (req, res, next) => {
        const { id } = req.params
        try {
            const block = await UserModel.findByIdAndUpdate(id, {
                isblocked: true,
            }, {
                new: true
            }
            )
            res.status(200).json({
                message: 'User blocked succesfully',
                user: block
            })
        } catch (error) {
            throw new Error('Error in block user ')

        }
    })



    // un block a user

    static unBlockUser = asynchandler(async (req, res, next) => {
        const { id } = req.params
        try {
            const block = await UserModel.findByIdAndUpdate(id, {
                isblocked: false,
            }, {
                new: true
            }
            )
            res.status(200).json({
                message: 'User unblocked succesfully',
                user: block
            })
        } catch (error) {
            throw new Error('Error in unblock user ')

        }

    })

    // change user password 
    static changeUserPassword = asynchandler(async (req, res) => {
        const { _id } = req.user
        const { oldPassword, newPassword } = req.body

        if (oldPassword && newPassword) {
            if (oldPassword === newPassword) {
                throw new Error('Old and New Password are not same')
            }
            const user = await UserModel.findById(_id)
            if (user) {
                let bcryptpass = await bcrypt.compare(oldPassword, user.password)
                if (bcryptpass) {
                    const newHasPaswrd = await bcrypt.hash(newPassword, 12)
                    console.log(req.user)
                    req.user.password = newHasPaswrd
                    await req.user.save()
                    res.status(200).json({
                        message: 'Password is changed Succesfully'
                    })
                } else {
                    throw new Error('Your old password is wrong')
                }
            } else {
                throw new Error('User not exists')
            }
        } else {
            throw new Error('oldPassword  and newPassword are required')
        }
    }
    )


    // Get a WishList

    static GetWishList = asynchandler(async (req, res) => {
        const { _id } = req.user
        try {
            const User = await UserModel.findById(_id)
            if (User) {
                const UserDetail = await UserModel.findById(_id).populate('wishlist')
                res.status(200).json({
                    message: 'WishList',
                    data: UserDetail.wishlist
                })
            }


        } catch (error) {
            console.log("Error in get the wishlist", error)
            throw new Error(error)
        }
    })


    // Add to Cart

    static AddtoCart = asynchandler(async (req, res, next) => {
        const { cart } = req.body
        const { _id } = req.user
        try {
            console.log(cart)
            let products = []
            const user = await UserModel.findById(_id)
            const alreadyExisCart = await CartModel.findOne({ OrderBy: user._id })
            console.log(alreadyExisCart)
            if (alreadyExisCart) {
                await CartModel.deleteOne({ _id: alreadyExisCart._id });
            }
            for (let i = 0; i < cart.length; i++) {
                let object = {}
                object.product = cart[i]._id
                object.count = cart[i].count
                object.color = cart[i].color
                let getPrice = await ProductModel.findById(cart[i]._id).select('price').exec()
                object.price = getPrice.price;
                products.push(object)
            }
            // console.log("asdfasdf",Products)
            let cartTotal = 0
            for (let i = 0; i < products.length; i++) {
                cartTotal += products[i].price * products[i].count
            }
            // console.log("totak",cartTotal)
            let newCart = await new CartModel({
                products,
                cartTotal,
                OrderBy: _id
            }).save()

            res.status(200).json({
                message: "Add to Cart done",
                newCart
            })
        } catch (error) {
            console.log(error)
        }
    })
    // get to cart
    static GetUserCart = asynchandler(async (req, res) => {
        const { _id } = req.user
        console.log("asdfasdfad", _id)
        try {
            const cart = await CartModel.findOne({ OrderBy: _id }).populate('products.product')
            console.log(cart)
            res.status(200).json({
                message: "User Cart",
                cart
            })
        } catch (error) {
            throw new Error(error)

        }
    })
    // empty cart

    static EmptyCart = asynchandler(async (req, res) => {
        const { _id } = req.user
        try {
            const user = await UserModel.findOne({ _id })

            const cart = await CartModel.findOneAndDelete({ OrderBy: user._id })
            res.status(200).json({
                message: "Your cart is  Empty ",
                cart
            })
        } catch (error) {
            throw new Error(error)

        }
    })


    static ApplyCoupon = asynchandler(async (req, res) => {
        const { coupon } = req.body
        const { _id } = req.user
        try {
            const validateCoupon = await CouponModel.findOne({ title: coupon })
            if (!validateCoupon) {
                throw new Error('Coupon is not present or expiry')
            }

            // here in coupon we need to add more things in model like if it have percentage discount
            // like 10 percent discount then calculation is woring 
            // or if we have percentage discount then  after   how many CartTotal  the discount will be applied 
            // or in percentage how much discount will be applied i.e upto 2000 or upto like this 

            // this functionlaity is remaining aor me be add later 


            const User = UserModel.findOne({ _id })
            const Cart = await CartModel.findOne({ OrderBy: _id })

            if (Cart) {
                let { products, cartTotal } = await CartModel.findOne({ OrderBy: _id }).populate('products.product')
                let totalAfterDiscount = cartTotal - validateCoupon.discount
                await CartModel.findOneAndUpdate({ OrderBy: _id }, { totalAfterDiscount }, { new: true })
                res.status(200).json({
                    message: "Coupon Applied Successfully",
                    totalAfterDiscount
                })
            } else {
                throw new Error("You don't have any products to apply coupon ")
            }
        } catch (error) {
            console.log("Error in Coupon", error)
            throw new Error(error)
        }
    })


    static CreateOrder = asynchandler(async (req, res) => {
        try {
            const { COD, couponApplied } = req.body
            const { _id } = req.user
            const UserCart = await CartModel.findOne({ OrderBy: _id })
            if (UserCart) {
                let finalAmount = 0
                if (couponApplied && UserCart.totalAfterDiscount) {
                    finalAmount = UserCart.totalAfterDiscount
                } else {
                    finalAmount = UserCart.cartTotal
                }

                let newOrder = await new OrderModel({
                    products: UserCart.products,
                    PaymentIntent: {
                        id: uniqid(),
                        method: "COD",
                        amount: finalAmount,
                        status: "Cash On Delivery",
                        created: new Date().toISOString(),
                        currency: "Rs"
                    },
                    OrderBy: _id,
                    orderStatus: 'Cash on Delivery'
                }).save()

                // update the products Details or soldcounts 
                let bulkOption = UserCart.products.map((item) => {
                    return {
                        updateOne: {
                            filter: { _id: item.product._id },
                            update: { $inc: { quantity: -item.count, sold: +item.count } }
                        }
                    }
                })
                const updated = await ProductModel.bulkWrite(bulkOption, {})
                res.status(200).json({
                    success: true,
                    message: "Order Created Successfully",
                    order: newOrder
                })
            } else {
                throw new Error('Cart is empty you does not  place the order in Empty Cart ')
            }
        } catch (error) {
            console.log("Error in Place Order", error)
            throw new Error(error)
        }

    })

    // Get Orders

    static GetOrders = asynchandler(async (req, res) => {
        try {
            const { _id } = req.user
            const orders = await OrderModel.find({ OrderBy: _id })
            if (orders) {
                res.status(200).json({
                    message: "Order Fetched Succesfully",
                    orders
                })
            } else {
                throw new Error(" you don't have any orders  ")
            }

        } catch (error) {

        }
    })


    //  Update Order Status

    static UpdateOrderStatus = asynchandler(async (req, res) => {
        try {
            const { status } = req.body
            const { id } = req.params
            const order = await OrderModel.findByIdAndUpdate(id, {
                orderStatus: status,
                PaymentIntent: {
                    status: status
                }
            }, { new: true })

            res.status(200).json({
                message: "Order Status Updated Successfully",
                order
            })
        }
        catch (err) {
            console.log(err);
            throw new Error(err)
        }
    })

}





module.exports = UserController