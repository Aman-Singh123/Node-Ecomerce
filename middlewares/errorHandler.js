// not found

const notfound = (req, res, next) => {
    const error = new Error(`Not found : ${req.originalUrl}`)
    res.status = 404
    next(error)
}

// Error handleer

const errorHandler = (err,req,res,next) => {
    const statuscode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statuscode)
    res.json({
        message: err?.message,
        stack:err?.stack
    })
}

module.exports = { notfound, errorHandler }