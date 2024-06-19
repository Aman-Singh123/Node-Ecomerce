// imports statements 

const env = require('dotenv')
env.config()
const express = require('express')
const connectDb = require('./config/dbconnect')
const Authrouter = require('./routes/AuthRoutes')
const cors = require('cors')
const bodyparser = require('body-parser')
const { notfound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const ProductRouter = require('./routes/ProductRoutes')
const morgan = require('morgan')
const Color = require('color');
const BlogRouter = require('./routes/BlogRoutes')
const CategoryRouter = require('./routes/CategoryRoutes')
const BlogCategoryRouter = require('./routes/BlogCategoryRoutes')
const BrandRouter = require('./routes/BrandRoutes')
const CouponRouter = require('./routes/CouponRoutes')
const ColorRouter = require('./routes/ColorRoutes')


// variables 
const app = express()
const port = process.env.PORT
const dbUrl = process.env.DBURL

const green = Color('#00ff00').hex();

// Custom morgan format with green color
morgan.token('green', (req, res, arg) => {
    return `\x1b[32m${arg}\x1b[0m`;
});

app.use(morgan((tokens, req, res) => {
    return [
        tokens.green(req, res, tokens.method(req, res)),
        tokens.green(req, res, tokens.url(req, res)),
        tokens.green(req, res, tokens.status(req, res)),
        tokens.green(req, res, tokens.res(req, res, 'content-length')),
        '-',
        tokens.green(req, res, tokens['response-time'](req, res)),
        'ms'
    ].join(' ');
}));

app.use(morgan('myFormat'));

app.use(cookieParser())
// app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.use('/user', Authrouter)
app.use('/product', ProductRouter)
app.use('/blog', BlogRouter)
app.use('/Category', CategoryRouter)
app.use('/BlogCategory', BlogCategoryRouter)
app.use('/Brand', BrandRouter)
app.use('/Coupon', CouponRouter)
app.use('/Color', ColorRouter)


app.use(notfound)
app.use(errorHandler)

// connect the db 
connectDb(dbUrl)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


